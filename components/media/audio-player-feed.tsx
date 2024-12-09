"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  MoreVertical,
  Dice3,
  UnfoldHorizontal,
  ListMusic,
  MessageCircleWarning,
  Music,
  Repeat,
  Shuffle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
}

export function AudioPlayer({ src, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume from 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else if (onEnded) {
        onEnded();
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, isLooping]);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const time = value[0];
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleLooping = () => {
    if (!audioRef.current) return;
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    if (audioRef.current) {
      audioRef.current.loop = newLoopState;
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    // Note: Actual shuffle implementation would require a playlist
    // This is just a UI toggle for now
  };

  // Determine volume icon based on current volume state
  const getVolumeIcon = () => {
    if (isMuted) return <VolumeX className="h-5 w-5" />;
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <div className="bg-card rounded-lg p-4 space-y-2">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />
      
      <div className="flex items-center space-x-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            aria-label="Seek time"
          />
        </div>

        <span className="text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {getVolumeIcon()}
          </Button>

          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              aria-label="Volume"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="More options">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={toggleLooping} 
              className={isLooping ? "bg-accent" : ""}
            >
              <Repeat className="h-4 w-4 mr-2" />
              {isLooping ? "Looping On" : "Loop"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={toggleShuffle} 
              className={isShuffling ? "bg-accent" : ""}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {isShuffling ? "Shuffling On" : "Shuffle"}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Music className="h-4 w-4 mr-2" />
                Create
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Dice3 className="h-4 w-4 mr-2" />
                    Clone Audio
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UnfoldHorizontal className="h-4 w-4 mr-2" />
                    Extend Audio
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <ListMusic className="h-4 w-4 mr-2" />
              Add to Playlist
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircleWarning className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}