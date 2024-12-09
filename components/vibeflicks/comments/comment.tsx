"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, MoreHorizontal, ChevronDown } from "lucide-react";
import { format } from "timeago.js";
import { CommentForm } from "./comment-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CommentProps {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: CommentProps[];
}

export function Comment({ 
  author, 
  avatar, 
  content, 
  timestamp, 
  likes, 
  replies = []
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [localReplies, setLocalReplies] = useState(replies);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLocalLikes(localLikes - 1);
    } else {
      setLocalLikes(localLikes + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleReply = (replyContent: string) => {
    const newReply = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop",
      content: replyContent,
      timestamp: new Date(),
      likes: 0,
    };
    setLocalReplies([...localReplies, newReply]);
    setIsReplying(false);
  };

  // Determine which replies to show
  const displayReplies = showAllReplies 
    ? localReplies 
    : localReplies.slice(0, 1);

  return (
    <div className="flex flex-col gap-2 p-4 border-b">
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{author}</span>
              <span className="text-sm text-gray-500">{format(timestamp)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-1">{content}</p>
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${hasLiked ? "text-blue-500" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" />
              {localLikes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="w-4 h-4" />
              Reply
            </Button>
          </div>
        </div>
      </div>
      
      {isReplying && (
        <div className="ml-12">
          <CommentForm
            onSubmit={handleReply}
            placeholder="Add a reply..."
            buttonText="Reply"
          />
        </div>
      )}
      
      {localReplies.length > 0 && (
        <div className="ml-12 border-l-2 pl-4">
          {displayReplies.map((reply) => (
            <Comment key={reply.id} {...reply} />
          ))}
          
          {localReplies.length > 1 && !showAllReplies && (
            <Button 
              variant="ghost" 
              className="text-blue-600 mt-2"
              onClick={() => setShowAllReplies(true)}
            >
              <ChevronDown className="mr-2 w-4 h-4" />
              Show {localReplies.length - 1} more repl{localReplies.length - 1 === 1 ? 'y' : 'ies'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}