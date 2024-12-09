import React from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
    id,
    className,
    background,
    minSize,
    maxSize,
    particleDensity,
    particleColor,
}: {
    id: string;
    className?: string;
    background?: string;
    minSize?: number;
    maxSize?: number;
    particleDensity?: number;
    particleColor?: string;
}) => {
    const randomNumberInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    const generateSparkles = () => {
        const sparkles = [];
        const particleCount = particleDensity || 50;

        for (let i = 0; i < particleCount; i++) {
            const size = randomNumberInRange(minSize || 0.4, maxSize || 1);
            const left = randomNumberInRange(0, 100);
            const top = randomNumberInRange(0, 100);
            const animationDelay = randomNumberInRange(0, 2);
            const duration = randomNumberInRange(2, 5);

            sparkles.push(
                <div
                    key={`sparkle-${i}`}
                    className={cn(
                        "absolute w-[1px] h-[1px] bg-white rounded-full opacity-0 animate-sparkle",
                        className
                    )}
                    style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        animationDelay: `${animationDelay}s`,
                        animationDuration: `${duration}s`,
                        backgroundColor: particleColor || "#FFFFFF",
                    }}
                />
            );
        }

        return sparkles;
    };

    return (
        <div
            id={id}
            className="absolute inset-0 overflow-hidden"
            style={{
                background:
                    "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 50.92%, rgba(204, 171, 238, 0) 70.35%)",
            }}
        >
            {generateSparkles()}
        </div>
    );
};