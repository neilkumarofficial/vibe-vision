"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VideoOverlayProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function VideoOverlay({ isPlaying, onTogglePlay }: VideoOverlayProps) {
  return (
    <>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>
      )}
    </>
  );
}