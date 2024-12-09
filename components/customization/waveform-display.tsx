"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, RepeatIcon } from "lucide-react";
import { Icon } from '@iconify/react';
import { useAudioContext } from "@/hooks/use-audio-context";

export function WaveVisualizer({ audioUrl }: { audioUrl?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { audioContext } = useAudioContext();

  useEffect(() => {
    if (!audioUrl || !canvasRef.current || !audioContext || !containerRef.current) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.crossOrigin = "anonymous";

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        const hue = 260 + (i / bufferLength) * 60;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;

        ctx.beginPath();
        ctx.roundRect(
          x,
          height - barHeight,
          barWidth - 2,
          barHeight,
          5
        );
        ctx.fill();

        x += barWidth;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Start animation
    draw();

    // GSAP animation for container glow
    gsap.to(containerRef.current, {
      duration: 2,
      boxShadow: "0 0 30px hsla(260, 100%, 60%, 0.3)",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      source.disconnect();
      analyser.disconnect();
    };
  }, [audioUrl, audioContext]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const handleDownload = async () => {
    if (!audioUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'audio_track.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1500);
    }
  };

  if (!audioUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="backdrop-blur-lg bg-opacity-50 border-primary/20">
        <CardContent className="p-6">
          <div 
            ref={containerRef}
            className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-1"
          >
            <canvas 
              ref={canvasRef} 
              className="w-full h-48 rounded-md"
              style={{ background: "transparent" }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>

          <motion.div 
            className="flex justify-center space-x-4 mt-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex space-x-2 items-center"
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRestart}
                  className="hover:bg-primary/20 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={togglePlayPause}
                  className="bg-primary hover:bg-primary/80 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant={isLooping ? "default" : "outline"} 
                  size="icon" 
                  onClick={toggleLoop}
                  className={isLooping ? "bg-primary hover:bg-primary/80" : "hover:bg-primary/20"}
                >
                  <RepeatIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="hover:bg-primary/20 transition-colors relative"
                >
                  {isDownloading ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      <Icon icon="line-md:loading-twotone-loop" className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Icon icon="solar:download-linear" className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}