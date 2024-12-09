"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostCard from "./post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";
import type { Post } from "@/types/types";

interface FeedProps {
  category?: string;
}

export default function Feed({ category = "all" }: FeedProps) {
  const { ref, inView } = useInView();
  const { posts, error, isLoadingMore, size, setSize } = usePosts(category);

  useEffect(() => {
    if (inView && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [inView, isLoadingMore, setSize, size]);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading posts</p>
        <Button onClick={() => setSize(1)} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const filteredPosts = category === "all" 
    ? posts 
    : posts.filter(post => post.type === category);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {filteredPosts.map((post: Post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoadingMore && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-card rounded-lg space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-48 w-full rounded-md" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={ref} className="h-1" />
    </div>
  );
}