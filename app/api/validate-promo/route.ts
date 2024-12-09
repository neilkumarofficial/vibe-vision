// app/api/validate-promo/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define types for our promo code structure
type PromoCode = {
    discount: number;
    maxUses: number;
    currentUses: number;
    expiryDate: string;
};

type PromoCodes = {
    [key: string]: PromoCode;
};

// Mock database of promo codes - in production, this would be in a real database
const promoCodes: PromoCodes = {
    'SAVE20': { discount: 0.2, maxUses: 100, currentUses: 0, expiryDate: '2024-12-31' },
    'SAVE50': { discount: 0.5, maxUses: 50, currentUses: 0, expiryDate: '2024-12-31' },
    'WELCOME100': { discount: 1, maxUses: 200, currentUses: 0, expiryDate: '2024-12-31' },
};

// Define types for the API response
type PromoResponse = {
    valid: boolean;
    message: string;
    discount?: number;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { code?: string };
        const { code } = body;

        if (!code) {
            return NextResponse.json<PromoResponse>({ 
                valid: false, 
                message: 'Promo code is required' 
            }, { status: 400 });
        }

        const upperCode = code.toUpperCase();
        const promoDetails = promoCodes[upperCode];

        if (!promoDetails) {
            return NextResponse.json<PromoResponse>({ 
                valid: false, 
                message: 'Invalid promo code' 
            }, { status: 200 });
        }

        // Check if promo code has expired
        const currentDate = new Date();
        const expiryDate = new Date(promoDetails.expiryDate);
        
        if (currentDate > expiryDate) {
            return NextResponse.json<PromoResponse>({ 
                valid: false, 
                message: 'Promo code has expired' 
            }, { status: 200 });
        }

        // Check if promo code has reached max uses
        if (promoDetails.currentUses >= promoDetails.maxUses) {
            return NextResponse.json<PromoResponse>({ 
                valid: false, 
                message: 'Promo code has reached maximum uses' 
            }, { status: 200 });
        }

        // In a real application, you would update the currentUses count in the database here
        promoCodes[upperCode].currentUses += 1;

        return NextResponse.json<PromoResponse>({
            valid: true,
            discount: promoDetails.discount,
            message: 'Promo code applied successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Promo code validation error:', error);
        return NextResponse.json<PromoResponse>({ 
            valid: false, 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}