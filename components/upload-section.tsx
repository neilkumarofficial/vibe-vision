"use client";

import { useState } from "react";
import { Upload, Music, Loader2, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { processAudioWithFFmpeg } from "@/lib/ffmpeg";
import { motion } from "framer-motion";
import { WaveVisualizer } from "./customization/waveform-display";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${index % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`}
            />
          );
        })
      )}
    </div>
  );
}

export function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      await processAudio(file);
    }
  };

  const processAudio = async (file: File) => {
    setIsUploading(true);
    setError(undefined);
    try {
      const processedAudioUrl = await processAudioWithFFmpeg(file);
      setAudioUrl(processedAudioUrl);
      setFiles([file]);
    } catch (error) {
      setError('Error processing audio. Please try again.');
      console.error('Error processing audio:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      await processAudio(file);
    }
  };

  const handleUrlSubmit = async () => {
    setError(undefined);
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const file = new File([blob], 'song.mp3', { type: 'audio/mpeg' });
      await processAudio(file);
    } catch (error) {
      setError('Invalid URL or network error. Please check the link.');
      console.error('URL processing error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-center">Upload Your Track</CardTitle>
          <CardDescription className="text-center">
            Drag and drop your audio file or click to browse. We support MP3, WAV, and FLAC formats.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full relative">
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <motion.div
            onClick={() => document.getElementById('file-input')?.click()}
            whileHover="animate"
            className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
            {...(isDragging ? { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop } : {})}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileSelect}
            />

            <div className="flex flex-col items-center justify-center relative z-20">
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-neutral-700 dark:text-neutral-300" />
                  <p className="text-sm text-neutral-400">
                    Processing your track...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 w-full max-w-xl mx-auto">
                  {files.length > 0 ? (
                    files.map((file, idx) => (
                      <motion.div
                        key={"file" + idx}
                        layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                        className={cn(
                          "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                          "shadow-sm"
                        )}
                      >
                        <div className="flex justify-between w-full items-center gap-4">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                          >
                            {file.name}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                          >
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </motion.p>
                        </div>

                        <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                          >
                            {file.type}
                          </motion.p>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            modified{" "}
                            {new Date(file.lastModified).toLocaleDateString()}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      layoutId="file-upload"
                      variants={mainVariant}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={cn(
                        "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                      )}
                    >
                      {isDragging ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-neutral-600 flex flex-col items-center"
                        >
                          Drop it
                          <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                        </motion.p>
                      ) : (
                        <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                      )}
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Paste audio URL"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        className="w-full sm:w-64"
                      />
                      {audioUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleUrlSubmit}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {error && (
            <p className="text-sm text-destructive text-center mt-4">{error}</p>
          )}
          {audioUrl && <WaveVisualizer audioUrl={audioUrl} />}
        </CardContent>
      </Card>
    </motion.div>
  );
}