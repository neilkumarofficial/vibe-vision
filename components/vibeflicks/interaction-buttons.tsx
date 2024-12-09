"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { CommentSection } from "./comments/comment-section";
import { ShareDialog } from "./share-dialog";
import { useState } from "react";

// Utility function to format large numbers
const formatCount = (count: number): string => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}m`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}k`;
  }
  return count.toString();
};

interface InteractionButtonsProps {
  likes: number;
  dislikes: number;
  comments: string;
  videoUrl: string;
  onLike?: () => void;
  onDislike?: () => void;
}

export function InteractionButtons({ 
  likes: initialLikes, 
  dislikes: initialDislikes, 
  videoUrl, 
  onLike, 
  onDislike 
}: InteractionButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<'liked' | 'disliked' | null>(null);

  const handleLike = () => {
    if (userAction === 'liked') {
      setLikes(prev => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === 'disliked') {
        setDislikes(prev => prev - 1);
      }
      setLikes(prev => prev + 1);
      setUserAction('liked');
    }
    onLike?.();
  };

  const handleDislike = () => {
    if (userAction === 'disliked') {
      setDislikes(prev => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === 'liked') {
        setLikes(prev => prev - 1);
      }
      setDislikes(prev => prev + 1);
      setUserAction('disliked');
    }
    onDislike?.();
  };

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-white rounded-full ${userAction === 'liked' ? 'text-blue-500' : ''}`}
          onClick={handleLike}
        >
          <ThumbsUp className="w-6 h-6" />
        </Button>
        <span className="text-white text-sm">{formatCount(likes)}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-white rounded-full ${userAction === 'disliked' ? 'text-red-500' : ''}`}
          onClick={handleDislike}
        >
          <ThumbsDown className="w-6 h-6" />
        </Button>
        <span className="text-white text-sm">{formatCount(dislikes)}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <CommentSection/>
      </div>
      <div className="flex flex-col items-center gap-1">
        <ShareDialog videoUrl={videoUrl} />
      </div>
      <Button variant="ghost" size="icon" className="text-white rounded-full">
        <MoreVertical className="w-6 h-6" />
      </Button>
    </div>
  );
}