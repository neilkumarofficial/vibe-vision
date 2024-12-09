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
    Maximize2,
    Minimize2,
    MoreVertical,
    Settings,
    Image,
    Share2,
    CaptionsOff,
    Subtitles,
    VolumeOff
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { formatTime } from "@/lib/utils";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    onEnded?: () => void;
    captions?: Array<{ src: string; label: string; srcLang: string }>;
}

export function VideoPlayer({ 
    src, 
    poster, 
    onEnded, 
    captions = [] 
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [selectedCaption, setSelectedCaption] = useState<string | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    let controlsTimeout: NodeJS.Timeout;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set initial volume and mute state
        video.volume = volume;
        video.muted = isMuted;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [volume, isMuted]);

    // Fullscreen effect
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        
        // Toggle mute state
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        
        if (videoRef.current) {
            videoRef.current.muted = newMuteState;
        }
    };

    const handleVolumeChange = (value: number[]) => {
        if (!videoRef.current) return;
        
        const newVolume = value[0];
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        
        // Unmute if volume is above 0
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
            videoRef.current.muted = false;
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleSeek = (value: number[]) => {
        if (!videoRef.current) return;
        const time = value[0];
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleMouseMove = () => {
        setIsControlsVisible(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying) {
                setIsControlsVisible(false);
            }
        }, 2000);
    };

    const handlePlaybackRateChange = (rate: string) => {
        if (!videoRef.current) return;
        const newRate = parseFloat(rate);
        setPlaybackRate(newRate);
        videoRef.current.playbackRate = newRate;
    };

    const handleCaptionChange = (caption: string | null) => {
        if (!videoRef.current) return;
        setSelectedCaption(caption);

        // Remove all existing text tracks
        const tracks = videoRef.current.textTracks;
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = 'disabled';
        }

        // Enable selected caption
        if (caption) {
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].label === caption) {
                    tracks[i].mode = 'showing';
                    break;
                }
            }
        }
    };

    // Volume icon selection logic
    const getVolumeIcon = () => {
        if (isMuted) return VolumeOff;
        if (volume === 0) return VolumeX;
        if (volume < 0.5) return Volume1;
        return Volume2;
    };

    const VolumeIcon = getVolumeIcon();

    return (
        <div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-lg overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onEnded={onEnded}
                onClick={togglePlay}
                playsInline
            >
                {captions.map((caption, index) => (
                    <track
                        key={index}
                        kind="subtitles"
                        src={caption.src}
                        srcLang={caption.srcLang}
                        label={caption.label}
                    />
                ))}
            </video>

            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
                    isControlsVisible ? "opacity-100" : "opacity-0"
                }`}
            >
                <div className="flex items-center space-x-4">
                    {/* Play/Pause Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={togglePlay}
                        className="text-white hover:text-white/80"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5" />
                        ) : (
                            <Play className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Time Slider */}
                    <div className="flex-1">
                        <Slider
                            value={[currentTime]}
                            min={0}
                            max={duration}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="cursor-pointer"
                            aria-label="Seek time"
                        />
                    </div>

                    {/* Current/Total Time */}
                    <span className="text-sm text-white tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleMute}
                            className="text-white hover:text-white/80"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            <VolumeIcon className="h-5 w-5" />
                        </Button>
                        <Slider
                            value={[volume]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="w-24"
                            aria-label="Volume"
                        />
                    </div>

                    {/* Fullscreen Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleFullscreen}
                        className="text-white hover:text-white/80"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="h-5 w-5" />
                        ) : (
                            <Maximize2 className="h-5 w-5" />
                        )}
                    </Button>

                    {/* More Options Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:text-white/80"
                                aria-label="More options"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Playback Speed Submenu */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Playback Speed
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup 
                                        value={playbackRate.toString()}
                                        onValueChange={handlePlaybackRateChange}
                                    >
                                        {[0.5, 1, 1.5, 2].map(rate => (
                                            <DropdownMenuRadioItem key={rate} value={rate.toString()}>
                                                {rate}x
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Subtitles Submenu */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    {selectedCaption ? <Subtitles className="h-4 w-4 mr-2" /> : <CaptionsOff className="h-4 w-4 mr-2" />}
                                    Subtitles
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup 
                                        value={selectedCaption || ''}
                                        onValueChange={handleCaptionChange}
                                    >
                                        <DropdownMenuRadioItem value="">
                                            Off
                                        </DropdownMenuRadioItem>
                                        {captions.map((caption) => (
                                            <DropdownMenuRadioItem key={caption.label} value={caption.label}>
                                                {caption.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Other Options */}
                            <DropdownMenuItem>
                                <Image className="h-4 w-4 mr-2" />
                                Picture in Picture
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}