// config/stripeConfig.ts
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const stripeAppearance: Appearance = {
    theme: 'night',
    variables: {
        colorPrimary: '#4c1d95',
        colorBackground: '#1e1b29',
        colorText: '#d4d4f7',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, roboto',
        spacingUnit: '4px',
        borderRadius: '4px',
    },
    rules: {
        '.Input': {
            backgroundColor: '#3c3168',
            color: '#e5e5f7',
        },
        '.Input:hover': {
            backgroundColor: '#4a3a7d',
        },
        '.Input:focus': {
            backgroundColor: '#4a3a7d',
            boxShadow: '0 0 0 1px #6d28d9',
        },
        '.Label': {
            color: '#b3b3d1',
        },
        '.Tab': {
            backgroundColor: '#3c3168',
            color: '#a1a1cf',
        },
        '.Tab:hover': {
            backgroundColor: '#4a3a7d',
            color: '#d4d4f7',
        },
        '.Tab--selected': {
            backgroundColor: '#6d28d9',
            color: '#ffffff',
        },
    },
};