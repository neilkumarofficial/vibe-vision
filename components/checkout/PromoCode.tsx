import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TagIcon, PartyPopper, X, AlertTriangle, Ban, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

// Toast types for different states
type ToastType = 'success' | 'error' | 'warning';

interface Toast {
    id: number;
    message: string;
    description?: string;
    type: ToastType;
    icon?: React.ReactNode;
}

const Toast: React.FC<Toast & { onClose: () => void }> = ({ message, description, type, icon, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
        fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm w-full 
        flex items-start gap-3 z-50
        ${type === 'success' ? 'bg-green-100 border-green-500' : ''}
        ${type === 'error' ? 'bg-red-100 border-red-500' : ''}
        ${type === 'warning' ? 'bg-yellow-100 border-yellow-500' : ''}
        border-l-4
      `}
        >
            <div className="flex-shrink-0 pt-0.5">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{message}</h3>
                {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Rest of the interfaces remain the same
interface PromoCodeSectionProps {
    onPromoApplied: (discount: number) => void;
}

interface AppliedPromo {
    code: string;
    discount: number;
}

interface PromoCodeResponse {
    valid: boolean;
    discount?: number;
    message: string;
}

interface ConfettiOptions {
    spread: number;
    startVelocity?: number;
    decay?: number;
    scalar?: number;
    particleCount?: number;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({ onPromoApplied }) => {
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoLoading, setPromoLoading] = useState<boolean>(false);
    const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Date.now();
        setToasts(current => [...current, { ...toast, id }]);
        setTimeout(() => removeToast(id), 5000); // Auto remove after 5 seconds
    };

    const removeToast = (id: number) => {
        setToasts(current => current.filter(toast => toast.id !== id));
    };

    const triggerConfetti = (): void => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 999,
        };

        function fire(particleRatio: number, opts: ConfettiOptions): void {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    const handlePromoCode = async (): Promise<void> => {
        if (!promoCode.trim()) {
            addToast({
                type: 'warning',
                message: 'Please enter a promo code',
                description: 'The promo code field cannot be empty',
                icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
            });
            return;
        }

        setPromoLoading(true);

        try {
            const response = await fetch('/api/validate-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: PromoCodeResponse = await response.json();

            if (data.valid && data.discount !== undefined) {
                triggerConfetti();
                setAppliedPromo({
                    code: promoCode.toUpperCase(),
                    discount: data.discount
                });
                onPromoApplied(data.discount);

                addToast({
                    type: 'success',
                    message: 'Promo code applied successfully!',
                    description: `You got ${data.discount * 100}% off your purchase!`,
                    icon: <PartyPopper className="h-4 w-4 text-green-500" />
                });

                setPromoCode('');
            } else {
                if (data.message.includes('expired')) {
                    addToast({
                        type: 'error',
                        message: 'Promo code has expired',
                        description: 'This promotion is no longer valid',
                        icon: <Clock className="h-4 w-4 text-red-500" />
                    });
                } else if (data.message.includes('maximum uses')) {
                    addToast({
                        type: 'error',
                        message: 'Promo code no longer available',
                        description: 'This promotion has reached its maximum usage limit',
                        icon: <Ban className="h-4 w-4 text-red-500" />
                    });
                } else {
                    addToast({
                        type: 'error',
                        message: 'Invalid promo code',
                        description: 'Please check your code and try again',
                        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
                    });
                }
            }
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Something went wrong',
                description: 'Unable to validate promo code. Please try again later.',
                icon: <AlertTriangle className="h-4 w-4 text-red-500" />
            });
            console.error('Promo code validation error:', error);
        } finally {
            setPromoLoading(false);
        }
    };

    const removePromoCode = (): void => {
        setAppliedPromo(null);
        onPromoApplied(0);
        addToast({
            type: 'success',
            message: 'Promo code removed',
            description: 'Your promo code has been removed successfully',
            icon: <X className="h-4 w-4 text-green-500" />
        });
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && !promoLoading) {
            e.preventDefault();
            handlePromoCode();
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPromoCode(e.target.value.toUpperCase());
    };

    return (
        <>
            <Card className="backdrop-blur-sm bg-card/40">
                <CardHeader>
                    <CardTitle className="text-lg">Have a promo code?</CardTitle>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {!appliedPromo ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex space-x-2"
                            >
                                <Input
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1"
                                    disabled={promoLoading}
                                    maxLength={20}
                                    aria-label="Promo code input"
                                />
                                <Button
                                    onClick={handlePromoCode}
                                    disabled={promoLoading}
                                    variant="secondary"
                                    aria-label={promoLoading ? "Applying promo code" : "Apply promo code"}
                                >
                                    {promoLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <TagIcon className="mr-2 h-4 w-4" />
                                            Apply
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20"
                            >
                                <div className="flex items-center space-x-3">
                                    <PartyPopper className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium text-sm">{appliedPromo.code}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {appliedPromo.discount * 100}% discount applied
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removePromoCode}
                                    className="h-8 w-8 p-0"
                                    aria-label="Remove promo code"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
};

export default PromoCodeSection;