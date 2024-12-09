"use client";

import { useVideoPlayer } from "@/hooks/use-video-player";
import { VideoOverlay } from "./video-overlay";
import { VideoControls } from "./video-controls";
import { InteractionButtons } from "./interaction-buttons";
import { VideoInfo } from "./video-info";
import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  description?: string;
  hashtags?: string[];
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  channelName, 
  channelAvatar,
  description = '',
  hashtags = []
}: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    changeVolume,
    toggleMute,
    toggleFullScreen,
    likes,
    dislikes,
    handleLike,
    handleDislike
  } = useVideoPlayer();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Force portrait orientation in fullscreen
      if (document.fullscreenElement) {
        try {
          // @ts-ignore
          screen.orientation.lock('portrait-primary').catch(() => {
            console.warn('Could not lock screen orientation');
          });
        } catch (error) {
          console.warn('Screen orientation lock not supported');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleVolumeChange = (value: number[]) => {
    changeVolume(value[0]);
  };

  return (
    <div className={`
      relative w-full h-full 
      aspect-9/16 max-w-[414px] mx-auto
      ${isFullscreen 
        ? 'fixed inset-0 z-50 w-full h-full' 
        : ''}
    `}>
      <div className={`
        relative w-full h-full
        ${isFullscreen 
          ? 'h-full w-full flex flex-col' 
          : ''}
      `}>
        <div className={`
          w-full flex-grow relative
          ${isFullscreen 
            ? 'h-[calc(100%-200px)] min-h-[400px]' 
            : 'aspect-9/16'}
        `}>
          <video
            ref={videoRef}
            className={`
              absolute inset-0 w-full h-full object-cover
              ${isFullscreen 
                ? 'object-contain' 
                : ''}
            `}
            loop
            playsInline
            onClick={togglePlay}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          
          <VideoOverlay isPlaying={isPlaying} onTogglePlay={togglePlay} />
          
          <VideoControls 
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
            onToggleFullScreen={toggleFullScreen}
          />
          
          <InteractionButtons 
            likes={likes}
            dislikes={dislikes}
            comments="0"
            videoUrl={videoUrl}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>
        
        {isFullscreen && (
          <div className="h-[200px] overflow-y-auto bg-black p-4">
            <VideoInfo 
              title={title}
              channelName={channelName}
              channelAvatar={channelAvatar}
              description={description}
              hashtags={hashtags}
            />
          </div>
        )}
        
        {!isFullscreen && (
          <VideoInfo 
            title={title}
            channelName={channelName}
            channelAvatar={channelAvatar}
            description={description}
            hashtags={hashtags}
          />
        )}
      </div>
    </div>
  );
}