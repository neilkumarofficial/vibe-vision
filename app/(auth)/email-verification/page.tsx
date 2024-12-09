'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from '@iconify/react';
import { toast } from "sonner";

const EmailVerificationPage: React.FC = () => {
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastResendTime, setLastResendTime] = useState<number | null>(null);

    useEffect(() => {
        // Check if there's a stored last resend time
        const storedResendTime = localStorage.getItem('lastResendTime');
        if (storedResendTime) {
            const timeSinceLastResend = Date.now() - parseInt(storedResendTime, 10);
            if (timeSinceLastResend < 60000) {
                // If less than 60 seconds have passed, start countdown
                const remainingTime = Math.ceil((60000 - timeSinceLastResend) / 1000);
                setCountdown(remainingTime);
                setCanResend(false);
            }
        }
    }, []);

    useEffect(() => {
        // Countdown timer for resend verification link
        let timer: NodeJS.Timeout | null = null;
        
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        
        if (countdown === 0) {
            setCanResend(true);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    const openEmailClient = () => {
        try {
            window.location.href = 'mailto:';
            
            toast.info('Opened email client', {
                description: 'Please check your inbox for the verification email.'
            });
        } catch (error) {
            toast.error('Unable to open email client', {
                description: 'Please check your email manually.'
            });
        }
    };

    const resendVerificationEmail = async () => {
        if (!canResend) return;

        setIsLoading(true);
        try {
            // Simulated email resend - replace with actual API call
            const response = await fetch('/api/resend-verification', { method: 'POST' });
            
            if (response.ok) {
                toast.success('Verification email resent', {
                    description: 'Check your inbox (including spam folder).'
                });
                
                // Store the time of resend
                const currentTime = Date.now();
                localStorage.setItem('lastResendTime', currentTime.toString());
                
                // Reset countdown
                setLastResendTime(currentTime);
                setCanResend(false);
                setCountdown(60);
            } else {
                toast.error('Failed to resend verification email', {
                    description: 'Please try again later.'
                });
            }
        } catch (error) {
            toast.error('Network error', {
                description: 'Please check your internet connection.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <SparklesCore
                    id="verification-sparkles"
                    background="purple"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    particleColor="#FFFFFF"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="bg-black/70 backdrop-blur-lg border border-white/20 text-white">
                    <CardHeader className="space-y-1 w-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                                Verify Your Email
                            </CardTitle>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Icon 
                                icon="mdi:email-check" 
                                className="mx-auto h-16 w-16 text-purple-500 mb-4" 
                            />

                            <p className="text-white/80 mb-4">
                                A verification link has been sent to your email address.
                                Please check your inbox (and spam folder) to complete the verification process.
                            </p>

                            <Button
                                onClick={openEmailClient}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mb-4"
                            >
                                <Icon icon="mdi:email-open" className="mr-2" />
                                Open Email Client
                            </Button>

                            <Button
                                onClick={resendVerificationEmail}
                                disabled={!canResend || isLoading}
                                className="w-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <Icon icon="mdi:loading" className="mr-2 animate-spin" />
                                ) : (
                                    <Icon icon="mdi:refresh" className="mr-2" />
                                )}
                                {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
                            </Button>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-white/60"
                        >
                            Having trouble? Contact{' '}
                            <a
                                href="mailto:support@yourcompany.com"
                                className="text-purple-400 hover:underline"
                            >
                                support
                            </a>
                        </motion.p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;