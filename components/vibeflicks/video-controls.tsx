"use client";

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onToggleFullScreen: () => void;
}

export function VideoControls({ 
  volume, 
  isMuted, 
  onVolumeChange, 
  onToggleMute, 
  onToggleFullScreen 
}: VideoControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="relative flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onToggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>
        <div
          className="absolute right-12 top-1/2 -translate-y-1/2 w-24 h-10 bg-black/80 rounded-lg flex items-center px-3"
        >
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={onVolumeChange}
            className="w-full"
          />
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white"
        onClick={onToggleFullScreen}
      >
        <Maximize2 className="w-6 h-6" />
      </Button>
    </div>
  );
}