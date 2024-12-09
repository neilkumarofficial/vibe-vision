"use client";

import { useInView } from "react-intersection-observer";
import { useState } from "react";
import Image from "next/image";
import { AudioPlayer } from "@/components/media/audio-player-feed";
import { VideoPlayer } from "@/components/media/video-player-feed";
import type { Media } from "@/types/types";

interface MediaPlayerProps {
  media: Media;
}

export default function MediaPlayer({ media }: MediaPlayerProps) {
  const [imageError, setImageError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  if (media.type === "image") {
    if (imageError) {
      return (
        <div className="relative aspect-video bg-muted flex items-center justify-center rounded-md">
          <p className="text-muted-foreground">Image unavailable</p>
        </div>
      );
    }

    return (
      <div className="relative aspect-video">
        <Image
          src={media.url}
          alt=""
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
          priority
        />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div ref={ref}>
        <VideoPlayer
          src={media.url}
          poster={media.thumbnail}
        />
      </div>
    );
  }

  if (media.type === "audio") {
    return (
      <div ref={ref}>
        <AudioPlayer src={media.url} />
      </div>
    );
  }

  return null;
}