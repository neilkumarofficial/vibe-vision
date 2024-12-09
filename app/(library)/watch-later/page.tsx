"use client"

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    PlayCircle,
    MoreVertical,
    Clock,
    Trash2,
    Share2,
    Download,
    ArrowUpDown,
    Shuffle,
    Brain,
    UserCircle2,
    Users,
    Zap,
    Activity,
    TrendingUp,
    Lightbulb
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    channel: string;
    uploadedAt: string;
    aiTags?: string[];
    recommendedBy?: string;
    matchScore?: number;
    popularity?: number;
    category?: string;
}

interface UserData {
    userId: string;
    displayName: string;
    avatar: string;
    interests?: string[];
}

interface CrossUserInsight {
    type: string;
    description: string;
    relevance: number;
    icon: React.ReactNode;
}

const STORAGE_KEY = 'watchLaterVideos';
const USERS_KEY = 'watchLaterUsers';

const DEFAULT_VIDEOS: Video[] = [
    {
        id: "1",
        title: "Ethical Hacking Full Course - Learn Ethical Hacking in 10 Hours",
        thumbnail: "/api/placeholder/320/180",
        duration: "9:56:19",
        views: "8.5M",
        channel: "edureka!",
        uploadedAt: "5 years ago",
        aiTags: ["Security", "Programming", "Career Growth"],
        recommendedBy: "Learning AI",
        matchScore: 95,
        popularity: 87,
        category: "Technology"
    },
    // Add more default videos as needed
];

const DEFAULT_USERS: UserData[] = [
    {
        userId: "default",
        displayName: "Default User",
        avatar: "/api/placeholder/40/40",
        interests: ["Technology", "Programming"]
    },
    {
        userId: "user2",
        displayName: "Tech Explorer",
        avatar: "/api/placeholder/40/40",
        interests: ["AI", "Data Science"]
    }
];

const WatchLaterPage = () => {
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState<Video[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [activeUser, setActiveUser] = useState<string>('default');
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [crossUserInsights, setCrossUserInsights] = useState<CrossUserInsight[]>([]);
    const [showInsightsDialog, setShowInsightsDialog] = useState(false);
    const [globalTrends, setGlobalTrends] = useState<{category: string, percentage: number}[]>([]);

    // Initialize users data
    useEffect(() => {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            setUsers(DEFAULT_USERS);
            localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        }
    }, []);

    // Load videos for active user
    useEffect(() => {
        const loadVideos = () => {
            const storedData = localStorage.getItem(`${STORAGE_KEY}_${activeUser}`);
            if (storedData) {
                setVideos(JSON.parse(storedData));
            } else {
                setVideos(DEFAULT_VIDEOS);
                localStorage.setItem(`${STORAGE_KEY}_${activeUser}`, JSON.stringify(DEFAULT_VIDEOS));
            }
            setLoading(false);
        };

        setTimeout(loadVideos, 1000);
    }, [activeUser]);

    // Generate cross-user insights
    useEffect(() => {
        if (!loading && users.length > 1) {
            const generateInsights = () => {
                const allUserVideos = users.map(user => {
                    const userData = localStorage.getItem(`${STORAGE_KEY}_${user.userId}`);
                    return userData ? JSON.parse(userData) : [];
                });

                // Calculate common interests and trends
                const allTags = allUserVideos.flat().flatMap(video => video.aiTags || []);
                const tagCount = allTags.reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                // Generate global trends
                const trends = Object.entries(tagCount)
                    .map(([category, count]: any) => ({
                        category,
                        percentage: (count / allTags.length) * 100
                    }))
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 5);

                setGlobalTrends(trends);

                // Generate cross-user insights
                const insights: CrossUserInsight[] = [
                    {
                        type: "Trend",
                        description: `"${trends[0]?.category}" is trending across all users`,
                        relevance: 95,
                        icon: <TrendingUp className="w-5 h-5 text-purple-400" />
                    },
                    {
                        type: "Recommendation",
                        description: "Users with similar interests watched 'Advanced AI Course'",
                        relevance: 88,
                        icon: <Lightbulb className="w-5 h-5 text-yellow-400" />
                    },
                    {
                        type: "Activity",
                        description: "3 users recently added similar content",
                        relevance: 82,
                        icon: <Activity className="w-5 h-5 text-green-400" />
                    }
                ];

                setCrossUserInsights(insights);
            };

            generateInsights();
        }
    }, [videos, users, loading]);

    // Save videos to localStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(`${STORAGE_KEY}_${activeUser}`, JSON.stringify(videos));
        }
    }, [videos, activeUser, loading]);

    const handleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        const sortedVideos = [...videos].sort((a, b) => {
            return newOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        setVideos(sortedVideos);
    };

    const handleShuffle = () => {
        const shuffledVideos = [...videos].sort(() => Math.random() - 0.5);
        setVideos(shuffledVideos);
    };

    const handleDelete = (video: Video) => {
        setSelectedVideo(video);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (selectedVideo) {
            const updatedVideos = videos.filter(v => v.id !== selectedVideo.id);
            setVideos(updatedVideos);
            setShowDeleteDialog(false);
            setSelectedVideo(null);
        }
    };

    const switchUser = (userId: string) => {
        setLoading(true);
        setActiveUser(userId);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-blue-950">
                <ScrollArea className="h-screen">
                    <div className="max-w-7xl mx-auto p-6 pt-32">
                        {/* Header with User Switcher and Global Insights */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2">
                                            <UserCircle2 className="w-5 h-5" />
                                            {users.find(u => u.userId === activeUser)?.displayName}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {users.map(user => (
                                            <DropdownMenuItem 
                                                key={user.userId}
                                                onClick={() => switchUser(user.userId)}
                                            >
                                                <img
                                                    src={user.avatar}
                                                    alt={user.displayName}
                                                    className="w-6 h-6 rounded-full mr-2"
                                                />
                                                {user.displayName}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                    onClick={() => setShowInsightsDialog(true)}
                                >
                                    <Users className="w-5 h-5" />
                                    Cross-User Insights
                                </Button>
                            </div>
                        </div>

                        {/* Main Content Card */}
                        <div className="rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 mb-8 backdrop-blur-sm border border-purple-500/20">
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl font-bold text-white">Watch Later</h1>
                                        <Brain className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <p className="text-gray-400">
                                        {videos.length} videos • AI-enhanced playlist
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        variant="secondary"
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                    >
                                        <Zap className="w-5 h-5" />
                                        Smart Play
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-purple-500"
                                        onClick={handleSort}
                                    >
                                        <ArrowUpDown className="w-5 h-5" />
                                        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-purple-500"
                                        onClick={handleShuffle}
                                    >
                                        <Shuffle className="w-5 h-5" />
                                        Shuffle
                                    </Button>
                                </div>
                            </div>

                            {/* Global Trends */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {globalTrends.slice(0, 3).map((trend, index) => (
                                    <div
                                        key={index}
                                        className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-purple-300 font-medium">
                                                {trend.category}
                                            </span>
                                            <span className="text-sm text-purple-400">
                                                {trend.percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={trend.percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>

                            {/* Cross-User Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {crossUserInsights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
                                    >
                                        {insight.icon}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-300">{insight.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-purple-400">
                                                    {insight.relevance}% relevant
                                                </span>
                                                <Progress value={insight.relevance} className="h-1 flex-1" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Videos Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-3 bg-purple-900/20 rounded-lg p-3 backdrop-blur-sm">
                                        <Skeleton className="h-[180px] w-full rounded-lg bg-purple-700/20" />
                                        <Skeleton className="h-4 w-3/4 bg-purple-700/20" />
                                        <Skeleton className="h-4 w-1/2 bg-purple-700/20" />
                                    </div>
                                ))
                            ) : (
                                videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="group relative bg-purple-900/20 rounded-lg p-3 backdrop-blur-sm transition-all hover:bg-purple-800/30 border border-purple-500/20"
                                    >
                                        {/* AI Match Score Badge */}
                                        {video.matchScore && (
                                            <div className="absolute top-5 left-5 bg-purple-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10">
                                                <Brain className="w-3 h-3" />
                                                {video.matchScore}% Match
                                            </div>
                                        )}

                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <PlayCircle className="text-white w-12 h-12" />
                                            </div>
                                            <span className="absolute bottom-2 right-2 bg-black/75 text-white text-sm px-2 py-1 rounded">
                                                {video.duration}
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-purple-300">
                                                {video.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mt-1">{video.channel}</p>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                <span>{video.views} views</span>
                                                <span>•</span>
                                                <span>{video.uploadedAt}</span>
                                            </div>

                                            {/* Enhanced AI Tags with Popularity Indicators */}
                                            {video.aiTags && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {video.aiTags.map((tag, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                                                        >
                                                            {tag}
                                                            {video.popularity && (
                                                                <TrendingUp className="w-3 h-3 ml-1" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Enhanced AI Recommendation Badge */}
                                            {video.recommendedBy && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-purple-300 bg-purple-500/10 p-2 rounded-lg">
                                                    <Brain className="w-4 h-4" />
                                                    <span>
                                                        Recommended by {video.recommendedBy}
                                                        {video.matchScore && ` • ${video.matchScore}% relevant`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Enhanced Video Actions */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-purple-500/20">
                                                <DropdownMenuItem className="flex items-center text-purple-300">
                                                    <Clock className="mr-2 h-4 w-4" /> Add to Queue
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center text-purple-300">
                                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center text-purple-300">
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-purple-500/20" />
                                                <DropdownMenuItem
                                                    className="flex items-center text-red-400"
                                                    onClick={() => handleDelete(video)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="bg-gray-900 text-white border border-purple-500/20">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Remove Video</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Are you sure you want to remove "{selectedVideo?.title}" from your Watch Later playlist?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowDeleteDialog(false)}
                                className="border-purple-500/20 text-purple-300"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={confirmDelete}
                                className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            >
                                Remove
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Cross-User Insights Dialog */}
                <Dialog open={showInsightsDialog} onOpenChange={setShowInsightsDialog}>
                    <DialogContent className="bg-gray-900 text-white border border-purple-500/20 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-400" />
                                Cross-User Insights
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                AI-powered analysis of watch patterns across all users
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-4">
                            {/* Global Trends Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-purple-300">Global Trends</h3>
                                <div className="space-y-3">
                                    {globalTrends.map((trend, index) => (
                                        <div key={index} className="bg-purple-900/20 p-3 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-purple-300">{trend.category}</span>
                                                <span className="text-sm text-purple-400">
                                                    {trend.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress value={trend.percentage} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Similarity Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-purple-300">User Similarity</h3>
                                <div className="space-y-3">
                                    {users.filter(u => u.userId !== activeUser).map((user, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-purple-900/20 p-3 rounded-lg">
                                            <img
                                                src={user.avatar}
                                                alt={user.displayName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-purple-300">{user.displayName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-purple-400">
                                                        {Math.floor(Math.random() * 30 + 70)}% similar interests
                                                    </span>
                                                    <Progress value={Math.random() * 30 + 70} className="h-1 flex-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default WatchLaterPage;