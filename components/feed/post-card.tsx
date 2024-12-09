"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/types/types";
import { cn } from "@/lib/utils";
import MediaPlayer from "./media-player";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  console.log('Post ID in card:', post.id);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <img src={post.author.avatar} alt={post.author.username} />
            </Avatar>
            <div>
              <Link href={`/u/${post.author?.username}`} className="font-medium hover:underline">
                {post.author?.username}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt))} ago in{" "}
                <Link href={`/r/${post.category}`} className="hover:underline">
                  r/{post.category}
                </Link>
              </p>
            </div>
          </div>


          <div className="space-y-4">
            <Link href={`/post/${post.id}`} className="block mt-3 cursor-pointer">
              <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            {post.media.length > 0 && (
              <div>
                {post.media.length === 1 ? (
                  <MediaPlayer media={post.media[0]} />
                ) : (
                  <Carousel>
                    {post.media.map((media, index) => (
                      <MediaPlayer key={index} media={media} />
                    ))}
                  </Carousel>
                )}
              </div>
            )}

            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn("space-x-2", liked && "text-primary")}
              onClick={handleLike}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-current")} />
              <span>{post.stats.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("space-x-2", disliked && "text-destructive")}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-5 w-5" />
              <span>{post.stats.dislikes}</span>
            </Button>

            <Button variant="ghost" size="sm" className="space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post.stats.comments}</span>
            </Button>

            <Button variant="ghost" size="sm" className="space-x-2">
              <Share2 className="h-5 w-5" />
              <span>{post.stats.shares}</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}