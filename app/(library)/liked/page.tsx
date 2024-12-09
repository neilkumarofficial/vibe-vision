"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Sparkles, Trash2, Clock, User, Heart } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface VideoUser {
  name: string;
  avatar?: string;
  username: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  aiScore: number;
  category: string;
  timestamp: number;
  user?: VideoUser;
}

const DEFAULT_USER: VideoUser = {
  name: "Anonymous User",
  username: "anonymous",
};

const LikedContent = () => {
  const [loading, setLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "aiScore">("recent");

  // Load data from localStorage
  useEffect(() => {
    const loadLikedVideos = () => {
      try {
        const savedVideos = localStorage.getItem("likedVideos");
        if (savedVideos) {
          setLikedVideos(JSON.parse(savedVideos));
        } else {
          // Demo data if nothing in localStorage
          const demoVideos: Video[] = [
            {
              id: "1",
              title: "Advanced AI Algorithms Explained: Deep Learning Revolution",
              description: "Explore the cutting-edge developments in artificial intelligence and how deep learning is transforming the technology landscape.",
              thumbnail: "/api/placeholder/320/180",
              duration: "15:30",
              views: "2.1M",
              aiScore: 98,
              category: "AI",
              timestamp: Date.now(),
              user: {
                name: "Alex Turner",
                username: "ai_alex"
              }
            },
            {
              id: "2",
              title: "Future of Machine Learning: 2024 Predictions",
              description: "Comprehensive analysis of upcoming ML trends and practical implementation guides.",
              thumbnail: "/api/placeholder/320/180",
              duration: "20:45",
              views: "1.8M",
              aiScore: 95,
              category: "ML",
              timestamp: Date.now() - 86400000,
              user: {
                name: "Sarah Chen",
                username: "ml_sarah"
              }
            },
          ];
          localStorage.setItem("likedVideos", JSON.stringify(demoVideos));
          setLikedVideos(demoVideos);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading liked videos:", error);
        setLoading(false);
      }
    };

    setTimeout(loadLikedVideos, 1000);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    }
  }, [likedVideos, loading]);

  const removeVideo = (id: string) => {
    setLikedVideos(prev => prev.filter(video => video.id !== id));
  };

  const getSortedAndFilteredVideos = () => {
    let filtered = filterCategory === "all" 
      ? likedVideos 
      : likedVideos.filter(v => v.category === filterCategory);

    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
      case "popular":
        return filtered.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
      case "aiScore":
        return filtered.sort((a, b) => b.aiScore - a.aiScore);
      default:
        return filtered;
    }
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 backdrop-blur-md bg-slate-900/50 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-purple-400 animate-pulse" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              AI Liked Content
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select 
                className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-purple-500 focus:ring-2 focus:ring-purple-400"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="ML">Machine Learning</option>
                <option value="DS">Data Science</option>
              </select>

              <select 
                className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-purple-500 focus:ring-2 focus:ring-purple-400"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "aiScore")}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="aiScore">Highest AI Score</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <Card key={i} className="bg-slate-800/50 backdrop-blur-sm border-purple-500/50">
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-[180px] w-full rounded-lg bg-slate-700" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-10 w-10 rounded-full bg-slate-700" />
                      <Skeleton className="h-4 w-3/4 bg-slate-700" />
                    </div>
                    <Skeleton className="h-4 w-1/2 bg-slate-700" />
                  </CardContent>
                </Card>
              ))
            ) : getSortedAndFilteredVideos().length === 0 ? (
              <Alert className="col-span-full bg-slate-800/50 border-purple-500">
                <AlertDescription>
                  No videos found in this category. Try changing your filters.
                </AlertDescription>
              </Alert>
            ) : (
              getSortedAndFilteredVideos().map((video) => {
                const user = video.user || DEFAULT_USER;
                return (
                  <Card 
                    key={video.id} 
                    className="group relative bg-slate-800/50 backdrop-blur-sm border-purple-500/50 hover:border-purple-400 transition-all overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                          {video.duration}
                        </span>
                        <div className="absolute top-2 right-2 flex items-center space-x-2 bg-black bg-opacity-75 rounded px-2 py-1">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className={`text-sm font-bold ${getAiScoreColor(video.aiScore)}`}>
                            {video.aiScore}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {/* User Info Row */}
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 border border-purple-500/50">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback className="bg-purple-900 text-purple-200">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>

                        {/* Title - Single Line */}
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                          {video.title}
                        </h3>

                        {/* Description - Two Lines */}
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {video.description}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span>{video.views} views</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(video.timestamp)}</span>
                            </span>
                          </div>
                          <button 
                            onClick={() => removeVideo(video.id)}
                            className="p-1 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="inline-block bg-purple-500/20 text-purple-400 text-sm px-2 py-1 rounded">
                          {video.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LikedContent;