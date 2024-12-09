"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsDown, 
  ArrowLeft,  
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Carousel } from "@/components/ui/carousel";
import MediaPlayer from "@/components/feed/media-player";

import { cn } from "@/lib/utils";
import type { Post } from "@/types/types";

// Mock post fetching function
const fetchPost = async (postId: string): Promise<Post> => {
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock post data
  return {
    id: postId,
    title: "Sample Post Title",
    content: "This is a sample post content.",
    author: {
      id: "1",
      username: "testuser",
      avatar: "/default-avatar.png"
    },
    createdAt: new Date().toISOString(),
    category: "general",
    tags: ["sample", "test"],
    media: [],
    type: "text",
    stats: {
      likes: 100,
      dislikes: 10,
      comments: 5,
      shares: 20
    }
  };
};

interface PostDetailViewProps {
  postId: string;
}

export default function PostDetailView({ postId }: PostDetailViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const fetchedPost = await fetchPost(postId);
        setPost(fetchedPost);
      } catch (err) {
        setError("Failed to load post");
        console.error(err);
      }
    }

    loadPost();
  }, [postId]);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Link href="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <Link href="/" className="mb-4 inline-block">
          <Button variant="ghost">
            <ArrowLeft className="mr-2" /> Back
          </Button>
        </Link>

        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center mb-4">
          <Avatar>
            <img 
              src={post.author.avatar} 
              alt={post.author.username} 
              className="rounded-full"
            />
          </Avatar>
          <div className="ml-3">
            <p className="font-semibold">{post.author.username}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p>{post.content}</p>
        </div>

        {post.media && post.media.length > 0 && (
          <div className="mb-4">
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

        <div className="flex space-x-4 mt-4">
          <Button 
            variant="ghost" 
            onClick={() => setLiked(!liked)}
            className={cn(liked && "text-primary")}
          >
            <Heart className={cn("mr-2", liked && "fill-current")} />
            {post.stats.likes}
          </Button>

          <Button 
            variant="ghost"
            onClick={() => setDisliked(!disliked)}
            className={cn(disliked && "text-destructive")}
          >
            <ThumbsDown className="mr-2" />
            {post.stats.dislikes}
          </Button>

          <Button variant="ghost">
            <MessageCircle className="mr-2" />
            {post.stats.comments}
          </Button>

          <Button variant="ghost">
            <Share2 className="mr-2" />
            {post.stats.shares}
          </Button>
        </div>
      </Card>
    </div>
  );
}