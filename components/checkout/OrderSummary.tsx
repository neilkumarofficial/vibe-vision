// OrderSummary.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlanDetails } from '@/types/types';

interface OrderSummaryProps {
    planDetails: PlanDetails;
    selectedAddons: string[];
    promoDiscount: number;
    calculateTotal: () => string;
    onAddonChange: (addonName: string, checked: boolean) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    planDetails,
    selectedAddons,
    promoDiscount,
    calculateTotal,
    onAddonChange,
}) => {
    // Helper function to format the billing period
    const formatBillingPeriod = (billingType: string) => {
        return billingType.toLowerCase() === 'yearly' ? '/year' : '/month';
    };

    // Helper function to format addon prices
    const formatAddonPrice = (price: number) => {
        return `+$${price}${formatBillingPeriod(planDetails.billingType)}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="backdrop-blur-sm bg-card/40 sticky top-6">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your plan and add-ons</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Plan Details */}
                        <div>
                            <h3 className="text-lg font-semibold">{planDetails.name}</h3>
                            <p className="text-sm text-muted-foreground">{planDetails.billingType}</p>
                        </div>

                        {/* Base Price */}
                        <div className="text-3xl font-bold text-primary">
                            ${planDetails.basePrice}
                            <span className="text-sm font-normal text-muted-foreground">
                                {formatBillingPeriod(planDetails.billingType)}
                            </span>
                        </div>

                        {/* Add-ons Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold">Available Add-ons</h4>
                            <div className="space-y-2">
                                {planDetails.addons?.map((addon) => (
                                    <div
                                        key={addon.name}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={addon.name}
                                                checked={selectedAddons.includes(addon.name)}
                                                onChange={(e) => onAddonChange(addon.name, e.target.checked)}
                                                className="rounded border-primary text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <div className="font-medium">{addon.name}</div>
                                                <div className="text-sm text-muted-foreground">{addon.description}</div>
                                            </div>
                                        </div>
                                        <div className="font-medium">{formatAddonPrice(addon.price)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Features included:</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {planDetails.features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span>Base Plan</span>
                                <span>${planDetails.basePrice}</span>
                            </div>
                            {selectedAddons.map((addonName) => {
                                const addon = planDetails.addons?.find(a => a.name === addonName);
                                return addon ? (
                                    <div key={addonName} className="flex justify-between text-sm">
                                        <span>{addon.name}</span>
                                        <span>+${addon.price}</span>
                                    </div>
                                ) : null;
                            })}
                            {promoDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-500">
                                    <span>Promo Discount</span>
                                    <span>-{promoDiscount * 100}%</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>${calculateTotal()}{formatBillingPeriod(planDetails.billingType)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};