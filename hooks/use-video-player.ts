import { useState, useRef, useCallback, useEffect } from 'react';

// Extend the Document type to include browser-specific fullscreen methods
interface FullscreenDocument extends Document {
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

// Extend the HTMLVideoElement type to include browser-specific fullscreen request methods
interface FullscreenVideoElement extends HTMLVideoElement {
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}

export function useVideoPlayer() {
  const videoRef = useRef<FullscreenVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    video.volume = clampedVolume;
    setVolume(clampedVolume);
    setIsMuted(clampedVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Unmute and restore previous volume
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
      setVolume(volume > 0 ? volume : 0.5);
    } else {
      // Mute
      video.volume = 0;
      setIsMuted(true);
      setVolume(0);
    }
  }, [isMuted, volume]);

  const toggleFullScreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cast document to our extended type
    const doc = document as FullscreenDocument;

    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { // Chrome/Safari
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { // Firefox
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { // Chrome/Safari
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { // IE/Edge
        doc.msExitFullscreen();
      }
    }
  }, []);

  // Optional: Add fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      // You can add any additional logic when fullscreen changes
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

  const handleLike = useCallback(() => {
    setLikes(prev => prev + 1);
  }, []);

  const handleDislike = useCallback(() => {
    setDislikes(prev => prev + 1);
  }, []);

  return {
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
  };
}