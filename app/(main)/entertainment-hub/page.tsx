"use client";

import { useState } from "react";
import Feed from "@/components/feed/feed";
import { Sidebar } from "@/components/feed/sidebar";
import { RecentPosts } from "@/components/feed/recent-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/hooks/use-posts";
import { Layout } from "@/components/layout/layout";
import router from "next/router";

export default function EntertainmentHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { posts } = usePosts();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <header className="relative top-0 w-full border-b bg-black/95 backdrop-blur">
          <div className="container mx-auto flex h-14 items-center">
            <div className="relative flex flex-1 items-center justify-center">
              <Input
                type="search"
                placeholder="Search posts..."
                className="h-9 w-full rounded-l-full border-r-0 border-gray-700 bg-black/75 px-4 text-gray-300 md:w-[400px] lg:w-[500px]"
              />
              <Button
                className="h-9 w-15 rounded-r-full border border-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-6">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_300px] gap-6">
            <aside className="hidden md:block">
              <Sidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </aside>

            <div className="space-y-3">
              <Feed category={selectedCategory} />
            </div>

            <aside className="hidden md:block space-y-6">
              <RecentPosts
                posts={posts.slice(0, 2)}
                onPostClick={(post) => {
                  // Navigate to post detail page or open modal
                  router.push(`/post/${post.id}`);
                }}
                onUserClick={(userId) => {
                  // Navigate to user profile
                  router.push(`/profile/${userId}`);
                }}
              />
            </aside>
          </div>
        </main>
      </div>
    </Layout>
  );
}