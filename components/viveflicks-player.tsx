"use client";

import { VideoPlayer } from "./vibeflicks/video-player";
import { Toaster } from "@/components/ui/sonner";

interface ShortsPlayerProps {
  videoUrl: string;
  title: string;
  channelName: string;
  likes: string;
  comments: string;
  channelAvatar: string;
  description: string;
  hashtags: string[];
}

export function ShortsPlayer(props: ShortsPlayerProps) {
  return (
    <>
      <div className="relative w-full max-w-[400px] h-[calc(100vh-20px)] mx-auto bg-black rounded-lg overflow-hidden">
        <VideoPlayer
          videoUrl={props.videoUrl}
          title={props.title}
          channelName={props.channelName}
          channelAvatar={props.channelAvatar}
          description={props.description}
          hashtags={props.hashtags}
        />
      </div>
      <Toaster />
    </>
  );
}