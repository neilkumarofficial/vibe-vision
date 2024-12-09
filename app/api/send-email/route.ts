import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import SubscriptionReceipt from '@/components/emails/SubscriptionReceipt';

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'edge'; // Example if you want to specify runtime
export const dynamic = 'force-dynamic'; // New dynamic/static configuration

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // CORS Configuration
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Explicitly handle POST method
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({
            error: `Method ${req.method} Not Allowed`,
            allowedMethods: ['POST']
        });
        return;
    }

    // Destructure request body with fallbacks
    const {
        to,
        subject,
        firstName,
        planName,
        billingType,
        totalAmount,
        features
    } = req.body || {};

    // Validate required fields
    if (!to || !subject) {
        return res.status(400).json({
            error: 'Missing required fields: to or subject'
        });
    }

    try {
        // Generate email HTML using React Email component
        const emailHtml = render(
            SubscriptionReceipt({
                firstName: firstName || 'Valued Customer',
                planName: planName || 'Subscription',
                billingType: billingType || 'Monthly',
                totalAmount: totalAmount || '0.00',
                features: features || []
            })
        );

        const { data, error } = await resend.emails.send({
            from: 'VibeDream <noreply@vibedream.ai>',
            to: [to],
            subject: subject,
            html: emailHtml
        });

        if (error) {
            console.error('Resend Email Error:', error);
            return res.status(400).json({ error });
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
