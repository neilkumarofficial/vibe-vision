"use client";

import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-teal-100 dark:from-purple-950 dark:to-teal-950 opacity-20" />
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Transform Your Favorite Tracks into{" "}
            <span className="text-primary">LoFi Masterpieces!</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your tracks, customize the vibe, and create your signature LoFi
            sound with our AI-powered converter.
          </p>
          <Button size="lg" className="rounded-full">
            <Music2 className="mr-2 h-5 w-5" />
            Start Creating LoFi Beats
          </Button>
          <div className="pt-8">
            <div className="animate-pulse">
              <svg
                className="w-full max-w-2xl mx-auto"
                height="60"
                viewBox="0 0 600 60"
              >
                <path
                  d="M 0 30 Q 150 10, 300 30 T 600 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}