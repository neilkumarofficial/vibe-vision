"use client";

import React, { useState, useEffect } from 'react';
import {
    Elements,
    PaymentElement,
    AddressElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, Lock, Shield, RefreshCw, ArrowLeft
} from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

// Components
import { Layout } from "@/components/layout/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SparklesCore } from '@/components/ui/sparkles';
import { SuccessModal } from '@/components/checkout/SuccessModal';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import PromoCodeSection from '@/components/checkout/PromoCode';

// Utils and Config
import { stripePromise, stripeAppearance } from '@/config/stripeConfig';
import type { PlanDetails, FormData } from '@/types/types';
import { Input } from '@/components/ui/input';

const formatBillingType = (billing: string | null): string => {
    if (!billing) return 'Monthly';
    return billing.charAt(0).toUpperCase() + billing.slice(1).toLowerCase();
};

const getAddons = (billingType: string) => {
    const isYearly = billingType.toLowerCase() === 'yearly';
    return [
        {
            name: "Family Access",
            price: isYearly ? 99.99 : 9.99,
            description: "Add up to 4 family members",
            saving: isYearly ? "Save $19.89" : null
        },
        {
            name: "Premium Support",
            price: isYearly ? 49.99 : 4.99,
            description: "24/7 priority support",
            saving: isYearly ? "Save $9.89" : null
        }
    ];
};

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const searchParams = useSearchParams();
    const router = useRouter();

    // State Management
    const [planDetails, setPlanDetails] = useState<PlanDetails>({
        name: "Premium Plan",
        price: "49.99",
        billingType: "Monthly",
        features: [
            "4K Streaming",
            "Unlimited Downloads",
            "Ad-free Experience",
            "Multiple Device Access"
        ],
        basePrice: "49.99",
        addons: getAddons("Monthly")
    });

    const [loading, setLoading] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isAddressComplete, setIsAddressComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<{
        success: boolean;
        formData: FormData | null;
    }>({
        success: false,
        formData: null
    });
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    // Calculate Total Price
    const calculateTotal = (): string => {
        let total = parseFloat(planDetails.basePrice);
        selectedAddons.forEach(addonName => {
            const addon = planDetails.addons?.find(a => a.name === addonName);
            if (addon) total += addon.price;
        });
        total = total - (total * promoDiscount);
        return total.toFixed(2);
    };

    // Handle Addon Changes
    const handleAddonChange = (addonName: string, checked: boolean) => {
        if (checked) {
            setSelectedAddons(prev => [...prev, addonName]);
        } else {
            setSelectedAddons(prev => prev.filter(name => name !== addonName));
        }
    };

    // Send confirmation email
    const sendConfirmationEmail = async () => {
        try {
            // Log the data being sent (be careful not to log sensitive info in production)
            console.log('Sending email with data:', {
                to: formData.email,
                firstName: formData.firstName,
                planName: planDetails.name,
                billingType: planDetails.billingType,
                totalAmount: calculateTotal(),
                features: planDetails.features
            });
    
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: formData.email,
                    subject: 'Your Entertainment Hub Subscription Confirmation',
                    firstName: formData.firstName,
                    planName: planDetails.name,
                    billingType: planDetails.billingType,
                    totalAmount: calculateTotal(),
                    features: planDetails.features
                }),
            });
    
            const responseBody = await response.json();
    
            if (!response.ok) {
                console.error('Email send error response:', responseBody);
                throw new Error(responseBody.error || 'Failed to send confirmation email');
            }
    
            // Optional: Add success toast
            toast.success('Confirmation email sent successfully');
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            toast.error(error instanceof Error ? error.message : 'Could not send confirmation email');
        }
    };

    // Load Plan Details
    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 1000,
                        currency: 'usd'
                    }),
                });
                const { clientSecret } = await response.json();

                const options = {
                    clientSecret,
                    appearance: stripeAppearance,
                };

                elements?.update(options);
            } catch (err) {
                console.error('Error fetching payment intent:', err);
                toast.error('Failed to initialize payment system');
            }
        };

        // Initialize from URL parameters
        const plan = searchParams.get('plan');
        const price = searchParams.get('price');
        const billing = searchParams.get('billing');
        const formattedBillingType = formatBillingType(billing);

        if (plan && price) {
            setPlanDetails(prevDetails => ({
                ...prevDetails,
                name: plan,
                price: price,
                basePrice: price,
                billingType: formattedBillingType,
                features: prevDetails.features,
                addons: getAddons(formattedBillingType)
            }));
            fetchPaymentIntent();
        }
    }, [searchParams, elements]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            toast.error('Payment system not ready');
            return;
        }

        setLoading(true);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message ?? 'Submission error occurred');
                toast.error(submitError.message ?? 'Submission error occurred');
                return;
            }

            const result = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            name: `${formData.firstName} ${formData.lastName}`,
                            email: formData.email,
                            phone: formData.phoneNumber,
                        },
                    },
                },
            });

            if (result.error) {
                // Handle the error case
                setError(result.error.message ?? 'Payment confirmation failed');
                toast.error(result.error.message ?? 'Payment confirmation failed');
            } else if (result.paymentIntent) {
                // Handle successful payment
                await sendConfirmationEmail();
                setPaymentStatus({
                    success: true,
                    formData: formData
                });
                setError(null); // Clear any existing errors
            }
        } catch (err) {
            // Handle unexpected errors
            const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Loading State
    if (!planDetails) {
        return (
            <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const handlePromoApplied = (discount: number) => {
        setPromoDiscount(discount);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle address element changes
    const handleAddressChange = (event: any) => {
        setIsAddressComplete(event.complete);
        const { firstName, lastName, phone } = event.value;

        setFormData(prev => ({
            ...prev,
            firstName: firstName || prev.firstName,
            lastName: lastName || prev.lastName,
            phoneNumber: phone || prev.phoneNumber,
        }));
    };

    return (
        <Layout>
            <div className="absolute inset-0 z-0">
                <SparklesCore
                    id="checkout-sparkles"
                    background="purple"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={500}
                    particleColor="#FFFFFF"
                />
            </div>
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <Link href="/" className="inline-flex items-center text-sm mb-8 hover:text-primary transition-colors z-10 absolute m-10">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-24">
                        {/* Left Side: Order Summary */}
                        <div className="space-y-6">
                            <OrderSummary
                                planDetails={planDetails}
                                selectedAddons={selectedAddons}
                                promoDiscount={promoDiscount}
                                calculateTotal={calculateTotal}
                                onAddonChange={handleAddonChange}
                            />

                            {/* Promo Code Section */}
                            <PromoCodeSection onPromoApplied={handlePromoApplied} />
                        </div>

                        {/* Right Side: Checkout Form */}
                        <div className="space-y-6">
                            <Card className="backdrop-blur-sm bg-card/40">
                                <CardHeader>
                                    <CardTitle>Complete your purchase</CardTitle>
                                    <CardDescription>Secure checkout process</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Email Input */}
                                        <div className="space-y-4">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                placeholder="Enter your email"
                                                required
                                                className="w-full"
                                            />
                                        </div>


                                        {/* Address Element */}
                                        <div className="space-y-4">
                                            <Label>Billing Address</Label>
                                            <AddressElement
                                                options={{
                                                    mode: 'billing',
                                                    fields: {
                                                        phone: 'always',
                                                    },
                                                    validation: {
                                                        phone: { required: 'always' }
                                                    },
                                                }}
                                                onChange={handleAddressChange}
                                            />
                                        </div>

                                        {/* Payment Element */}
                                        <div className="space-y-4">
                                            <Label>Payment Details</Label>
                                            <PaymentElement
                                                options={{ layout: 'tabs' }}
                                                onChange={(event) => setIsPaymentComplete(event.complete)}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full transition-all"
                                            disabled={!stripe || loading || !isAddressComplete || !isPaymentComplete}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div className="flex items-center">
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </motion.div>
                                                ) : (
                                                    <motion.div className="flex items-center">
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Pay ${calculateTotal()}
                                                        <span className="ml-1">
                                                            {planDetails.billingType.toLowerCase() === 'yearly' ? '/year' : '/month'}
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Secured by Stripe
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4" />
                                        30-day money-back guarantee
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </motion.div>

                {/* Success Modal */}
                <SuccessModal
                    isVisible={paymentStatus.success}
                    onClose={() => setPaymentStatus({ success: false, formData: null })}
                    formData={paymentStatus.formData}
                />
            </div>
        </Layout>
    );
};

export default function CheckoutPage() {
    const options: StripeElementsOptions = {
        mode: 'payment' as const,
        amount: 1999,
        currency: 'usd'
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
}