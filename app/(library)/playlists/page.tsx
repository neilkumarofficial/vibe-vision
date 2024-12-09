"use client"
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Search, Bookmark, List } from "lucide-react";
import { Layout } from '@/components/layout/layout';
import VideoLayout from '@/components/media/VideoLayout';

const categories = [
  "All",
  "Machine Learning",
  "Neural Networks",
  "Computer Vision",
  "NLP",
  "Robotics",
  "Ethics in AI"
];

const PlaylistsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userInfo, setUserInfo] = useState({ name: "AI Enthusiast", savedCount: 0 });

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    const userInfoData = savedUserInfo ? JSON.parse(savedUserInfo) : {
      name: "AI Enthusiast",
      savedCount: 0
    };
    setUserInfo(userInfoData);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Header Section */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <List className="w-8 h-8 text-purple-400" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                  AI Playlist
                </h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search AI content..."
                    className="pl-10 pr-4 py-2 w-80 bg-white/5 rounded-full border border-white/10 focus:outline-none focus:border-purple-500 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Bookmark className="h-5 w-5 text-purple-400" />
                  <span className="text-white">{userInfo.savedCount} saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Router>
          <VideoLayout />
        </Router>
      </div>
    </Layout>
  );
};

export default PlaylistsPage;