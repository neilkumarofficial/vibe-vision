import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// UI Components from shadcn/ui
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Icons from Lucide React
import { PlayCircle, Clock, Eye } from 'lucide-react';

// Types for better type safety

type ContentItem = {
    _id: string;
    userName: string;
    contentType: string;
    status: string;
    videoUrl?: string;
    audioUrl?: string;
    imageUrl?: string | null;
    thumbnail_alt?: string | null;
    musicTitle?: string | null;
    displayName?: string | null;
    createdAt: string;
    enhancedPrompt: string;
    userPrompt: string;
    songLyrics: string
};
// Constants
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://vibevision.ai';

const VideoLayout: React.FC = () => {
    // State management
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredPlaylists, setFilteredPlaylists] = useState<ContentItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [data, setData] = useState<ContentItem[]>([]);

    const filteredData = data.filter((dataItem) => dataItem.status === 'success').reverse();

    // Navigation hook
    const navigate = useNavigate();

    // Fetch user content effect
    useEffect(() => {
        const fetchUserContent = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ContentItem[]>(`${BASE_URL}/api/content/get-all-content`);

                // Validate response data
                if (Array.isArray(response.data)) {
                    setFilteredPlaylists(response.data);
                    setData(response.data);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                setError('Failed to load videos. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserContent();
    }, []);

    // Video click handler with error boundary
    const handleVideoClick = (video: ContentItem) => {
        try {
            navigate(`/watch/${video._id}`, {
                state: { video },
                replace: false
            });
        } catch (error) {
            console.error('Navigation error:', error);
            // Optional: Add toast or error notification
        }
    };

    // Error rendering
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    // Skeleton Loading State
                    [...Array(8)].map((_, i) => (
                        <Card
                            key={i}
                            className="bg-white/5 border-white/10 animate-pulse"
                        >
                            <CardContent className="p-0">
                                <Skeleton className="h-[180px] w-full rounded-t-lg" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : filteredData.length > 0 ? (
                    // Video Content State
                    filteredData.map((video) => (
                        <Card
                            key={video._id}
                            className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            onClick={() => handleVideoClick(video)}
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <Badge className="bg-purple-500/80 text-white">
                                            {video.contentType}
                                        </Badge>
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="relative aspect-video">
                                        <img
                                            src={video.imageUrl || video.thumbnail_alt || ''}
                                            alt={video.displayName || 'Video Name'}
                                            className="rounded-t-lg object-cover w-full h-full"
                                            loading="lazy"
                                        />

                                        {/* Hover Play Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-16 h-16"
                                            />
                                        </div>

                                        {/* Duration Badge */}
                                        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                                            <span className="bg-black/80 text-white text-sm px-2 py-1 rounded-full flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {'12:42'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Video Details */}
                                <div className="p-4 space-y-2">
                                    <h3 className="text-lg font-semibold text-white truncate">
                                        {video.displayName || 'Video Name'}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {video.enhancedPrompt}
                                    </p>

                                    {/* User and Views */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={'https://api.dicebear.com/9.x/adventurer/svg?seed=Jack'}
                                                alt={video.userName}
                                                className="w-6 h-6 rounded-full"
                                                loading="lazy"
                                            />
                                            <span className="text-gray-400 text-sm">{video.userName}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {video.status.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    // Empty State
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No videos found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoLayout;