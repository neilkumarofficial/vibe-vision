import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

const REDIRECT_DELAY = 5000; // 5 seconds

export const SuccessModal = ({ isVisible, onClose, formData }: any) => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(REDIRECT_DELAY / 1000);

    const triggerFireworks = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => 
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Launch from left side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });

            // Launch from right side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    useEffect(() => {
        if (isVisible) {
            // Reset states when modal becomes visible
            setProgress(0);
            setTimeLeft(REDIRECT_DELAY / 1000);

            // Trigger fireworks animation
            triggerFireworks();

            // Progress bar animation
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 2;
                    return newProgress <= 100 ? newProgress : 100;
                });
            }, REDIRECT_DELAY / 50); // Smooth animation over 50 steps

            // Countdown timer
            const countdownInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Redirect after delay
            const redirectTimer = setTimeout(() => {
                router.push('/entertainment-hub');
            }, REDIRECT_DELAY);

            // Cleanup
            return () => {
                clearInterval(progressInterval);
                clearInterval(countdownInterval);
                clearTimeout(redirectTimer);
            };
        }
    }, [isVisible, router]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative overflow-hidden"
                    >
                        {/* Success animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="absolute top-0 left-0 w-full h-1 bg-primary/10"
                        >
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: REDIRECT_DELAY / 1000 }}
                            />
                        </motion.div>

                        <div className="text-center space-y-6">
                            {/* Success icon */}
                            <div className="relative h-16">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-center"
                                >
                                    <div className="relative">
                                        <PartyPopper className="h-16 w-16 text-primary" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="absolute -bottom-2 -right-2"
                                        >
                                            <CheckCircle className="h-8 w-8 text-green-500 bg-background rounded-full" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Success message */}
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-primary">Payment Successful!</h2>
                                <p className="text-muted-foreground">
                                    Thank you for your purchase, {formData?.firstName || 'valued customer'}!
                                </p>
                            </div>

                            {/* Confirmation details */}
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>A confirmation email has been sent to:</p>
                                <p className="font-medium text-foreground">{formData?.email}</p>
                                <p>Redirecting to Entertainment Hub in {timeLeft} seconds...</p>
                            </div>

                            {/* Progress indicator */}
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-center gap-3">
                                <Button 
                                    onClick={() => router.push('/entertainment-hub')} 
                                    variant="default"
                                    className="min-w-[140px]"
                                >
                                    Continue Now
                                </Button>
                                <Button 
                                    onClick={onClose} 
                                    variant="outline"
                                    className="min-w-[140px]"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;