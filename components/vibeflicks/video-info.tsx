"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface VideoInfoProps {
  title: string;
  description: string;
  hashtags: string[];
  channelName: string;
  channelAvatar: string;
}

export function VideoInfo({ 
  title, 
  description, 
  hashtags, 
  channelName, 
  channelAvatar 
}: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Truncate description to first line
  const truncateDescription = (text: string, maxLength: number = 50) => {
    return text.length > maxLength 
      ? text.slice(0, maxLength) + '...' 
      : text;
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 text-white">

      {/* Channel Info */}
      <div className="flex items-center gap-2">
        <Image
          src={channelAvatar}
          alt={channelName}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium">@{channelName}</span>
        <Button variant="secondary" size="sm" className="gap-3 rounded-full bg-white text-black hover:bg-white/50">
          Subscribe
        </Button>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold w-4/5 mb-2">{title}</h2>

      {/* Description with expand/collapse */}
      <div className="mb-2">
        <p className="text-sm">
          {isDescriptionExpanded 
            ? description 
            : truncateDescription(description)}
          {description.length > 50 && (
            <button 
              onClick={toggleDescription} 
              className="ml-2 text-blue-300 hover:underline"
            >
              {isDescriptionExpanded ? 'Collapse' : 'More'}
            </button>
          )}
        </p>
      </div>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {hashtags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-white/20 rounded-full px-2 py-1 text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

    </div>
  );
}