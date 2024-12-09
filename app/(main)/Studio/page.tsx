'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Navigation, Keyboard, Pagination, Autoplay } from 'swiper/modules';
import {
    Play, Sparkles, Music, Video, Type, Mic, MessageCircle, Camera, BookOpen, PenTool, VideoIcon, TrendingUp, Award, Users,
    PlaySquare, Lightbulb, User, Star,
    ChevronRight,
    Heart,
    Share2,
    Pause
} from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { LampContainer } from "@/components/ui/lamp";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import MusicPlayer from '@/components/media/music-player';

// TypeScript interfaces
interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    path: string;
    bgPattern: string;
}

interface Features {
    music: Feature[];
    video: Feature[];
    text: Feature[];
}

interface FeatureCardProps {
    feature: Feature;
    onClick: (path: string) => void;
    isLoading: boolean;
}

interface CategorySectionProps {
    title: string;
    icon: React.ReactNode;
    features: Feature[];
    onClick: (path: string) => void;
    isLoading: boolean;
}

interface SectionProps {
    isLoading: boolean;
}

// interface EnhancedFeatureGridProps {
//     onNavigate: (path: string) => void;
// }

const tutorials = [
    {
        id: 1,
        title: "Create AI-Powered Roast Comments for Your Photos",
        description: "Learn how to use Roast My Pic! to generate hilarious and witty AI roasts for any photo. Discover advanced prompting techniques and best practices for entertaining results.",
        thumbnail: "/api/placeholder/400/225",
        author: {
            name: "Sarah Johnson",
            avatar: "/api/placeholder/40/40",
            role: "AI Content Creator"
        }
    },
    {
        id: 2,
        title: "Crafting Engaging Stories with Story Forge AI",
        description: "Master the art of storytelling using Story Forge AI. This tutorial covers character development, plot generation, and how to refine AI-generated narratives.",
        thumbnail: "/api/placeholder/400/225",
        author: {
            name: "Michael Chen",
            avatar: "/api/placeholder/40/40",
            role: "Creative Writer"
        }
    },
    {
        id: 3,
        title: "Advanced Photo Roasting Techniques",
        description: "Take your photo roasting to the next level with advanced features. Learn about style customization, theme-based roasts, and creating viral-worthy content.",
        thumbnail: "/api/placeholder/400/225",
        author: {
            name: "Alex Rivera",
            avatar: "/api/placeholder/40/40",
            role: "Social Media Expert"
        }
    },
    {
        id: 4,
        title: "World-Building with Story Forge AI",
        description: "Explore how to create immersive fictional worlds using Story Forge AI. From fantasy realms to sci-fi universes, learn the secrets of AI-powered world-building.",
        thumbnail: "/api/placeholder/400/225",
        author: {
            name: "Emma Watson",
            avatar: "/api/placeholder/40/40",
            role: "Fiction Author"
        }
    },
    {
        id: 5,
        title: "Monetizing Your AI-Generated Content",
        description: "Turn your AI creations into income streams. This guide shows how to market and monetize content created with Roast My Pic! and Story Forge AI.",
        thumbnail: "/api/placeholder/400/225",
        author: {
            name: "David Kim",
            avatar: "/api/placeholder/40/40",
            role: "Digital Entrepreneur"
        }
    }
];

// Features data
const features: Features = {
    music: [
        {
            title: 'Song Creation',
            description: 'Create original songs with AI assistance and professional tools',
            icon: <Mic className="w-8 h-8" />,
            gradient: 'from-blue-500 to-teal-500',
            path: '/custom-song-generator',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17l-7-7h14l-7 7z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        },
        {
            title: 'Lofi Mix',
            description: 'Generate Relaxing Lofi Music videos for you!',
            icon: <Sparkles className="w-8 h-8" />,
            gradient: 'from-orange-500 to-red-500',
            path: '/custom-song-generator',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h16a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm0 2v16h16V2H2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        },
        {
            title: 'Custom Song',
            description: 'Personalize existing tracks with AI-powered remixing tools',
            icon: <Sparkles className="w-8 h-8" />,
            gradient: 'from-purple-900 to-indigo-600',
            path: '/custom-song-generator',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h16a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm0 2v16h16V2H2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        },
    ],
    video: [
        {
            title: 'Roast My Pic!',
            description: 'Tell VibeVision AI to roast an Image you submit!',
            icon: <Camera className="w-8 h-8" />,
            gradient: 'from-orange-500 to-red-500',
            path: '/15-reel',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        {
            title: 'Story Forge AI',
            description: 'Generate unique comedy storylines with AI',
            icon: <BookOpen className="w-8 h-8" />,
            gradient: 'from-blue-600 to-indigo-500',
            path: '/story-generation',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h16a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm0 2v16h16V2H2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        },
        {
            title: 'Video Magic',
            description: 'Transform your videos with AI effects and enhancements',
            icon: <VideoIcon className="w-8 h-8" />,
            gradient: 'from-green-500 to-teal-500',
            path: '/video-magic',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17l-7-7h14l-7 7z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        }
    ],
    text: [

        {
            title: 'Script Wizard',
            description: 'Craft engaging scripts with AI assistance',
            icon: <PenTool className="w-8 h-8" />,
            gradient: 'from-pink-500 to-rose-500',
            path: '/script-wizard',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L10 10zm10 10L20 20V0zM0 20h20L10 10z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        },
        {
            title: 'Caption Generator',
            description: 'Create witty captions for your content',
            icon: <MessageCircle className="w-8 h-8" />,
            gradient: 'from-green-500 to-emerald-500',
            path: '/caption-generator',
            bgPattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L10 10zm10 10L20 20V0zM0 20h20L10 10z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        }
    ]
};
// Popular artists data
const popularArtists = [
    {
        id: 1,
        name: 'Sarah Brooks',
        avatar: '/artists/sarah.jpg',
        followers: '1.2M',
        bio: 'Electronic music producer known for ambient soundscapes',
        popularTrack: 'Neon Dreams'
    },
    {
        id: 2,
        name: 'The Neural Beats',
        avatar: '/artists/neural.jpg',
        followers: '892K',
        bio: 'AI-assisted music collective pushing boundaries',
        popularTrack: 'Digital Horizon'
    },
    {
        id: 3,
        name: 'Samel',
        avatar: '/artists/sarah.jpg',
        followers: '1.2M',
        bio: 'Electronic music producer known for ambient soundscapes',
        popularTrack: 'Neon Dreams'
    },
    {
        id: 4,
        name: 'Honey Singh',
        avatar: '/artists/neural.jpg',
        followers: '892K',
        bio: 'AI-assisted music collective pushing boundaries',
        popularTrack: 'Digital Horizon'
    },
    {
        id: 5,
        name: 'Lucifer Morningstar',
        avatar: '/artists/sarah.jpg',
        followers: '1.2M',
        bio: 'Electronic music producer known for ambient soundscapes',
        popularTrack: 'Neon Dreams'
    },
    {
        id: 6,
        name: 'BlackPink',
        avatar: '/artists/neural.jpg',
        followers: '892K',
        bio: 'AI-assisted music collective pushing boundaries',
        popularTrack: 'Digital Horizon'
    },
    // Add more artists...
];

const trendingSongs = [
    {
        id: 1,
        title: 'Midnight Dreams',
        artist: 'The Cosmic Band',
        genre: 'Electronic',
        views: '1.2M',
        likes: '45K',
        duration: 237,
        releaseDate: '2024-03-15',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 128,
        key: 'Am',
        tags: ['electronic', 'ambient', 'chill']
    },
    {
        id: 2,
        title: 'Sunset Boulevard',
        artist: 'Aurora Waves',
        genre: 'Indie Pop',
        views: '850K',
        likes: '30K',
        duration: 210,
        releaseDate: '2023-10-10',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 115,
        key: 'G',
        tags: ['indie pop', 'melancholy', 'vibes']
    },
    {
        id: 3,
        title: 'High Tides',
        artist: 'Ocean Echoes',
        genre: 'Lo-Fi',
        views: '2.3M',
        likes: '80K',
        duration: 185,
        releaseDate: '2023-12-20',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 90,
        key: 'Dm',
        tags: ['lo-fi', 'relaxing', 'study']
    },
    {
        id: 4,
        title: 'Cosmic Dance',
        artist: 'Nebula Knights',
        genre: 'Psychedelic',
        views: '1.5M',
        likes: '60K',
        duration: 260,
        releaseDate: '2024-01-05',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 130,
        key: 'B',
        tags: ['psychedelic', 'groovy', 'upbeat']
    },
    {
        id: 5,
        title: 'Into the Wild',
        artist: 'The Forest Ensemble',
        genre: 'Folk',
        views: '950K',
        likes: '35K',
        duration: 240,
        releaseDate: '2023-08-17',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 100,
        key: 'C',
        tags: ['folk', 'acoustic', 'nature']
    },
    {
        id: 6,
        title: 'Neon Skies',
        artist: 'City Lights Collective',
        genre: 'Synthwave',
        views: '3.1M',
        likes: '120K',
        duration: 220,
        releaseDate: '2024-04-05',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 135,
        key: 'Ebm',
        tags: ['synthwave', 'retro', '80s']
    },
    {
        id: 7,
        title: 'Dreamscape',
        artist: 'Echo Reflections',
        genre: 'Ambient',
        views: '1.8M',
        likes: '70K',
        duration: 255,
        releaseDate: '2023-11-22',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 75,
        key: 'Bb',
        tags: ['ambient', 'meditative', 'dreamy']
    },
    {
        id: 8,
        title: 'Urban Flow',
        artist: 'Rhythm Syndicate',
        genre: 'Hip-Hop',
        views: '2.7M',
        likes: '95K',
        duration: 200,
        releaseDate: '2023-09-14',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 92,
        key: 'Fm',
        tags: ['hip-hop', 'urban', 'chill']
    },
    {
        id: 9,
        title: 'Galactic Voyage',
        artist: 'Space Explorers',
        genre: 'Electronic',
        views: '3.5M',
        likes: '150K',
        duration: 245,
        releaseDate: '2024-02-02',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 122,
        key: 'G#m',
        tags: ['electronic', 'space', 'journey']
    },
    {
        id: 10,
        title: 'Morning Dew',
        artist: 'Nature Sounds',
        genre: 'New Age',
        views: '1.1M',
        likes: '50K',
        duration: 210,
        releaseDate: '2023-05-01',
        coverArt: '/api/placeholder/400/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        waveformData: Array.from({ length: 100 }, () => Math.random()),
        bpm: 60,
        key: 'Cmaj7',
        tags: ['new age', 'calm', 'nature']
    }
    // Add more songs as needed
];


// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="h-[300px]">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <Skeleton className="h-16 w-16 rounded-full mb-6" />
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => onClick(feature.path)}
        >
            <Card className={`relative overflow-hidden h-[300px] bg-gradient-to-br ${feature.gradient}`}>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: feature.bgPattern }}
                />
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-white relative z-10">
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 p-4 bg-white/10 rounded-full"
                    >
                        {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-sm text-center text-white/90 mb-4">{feature.description}</p>
                    <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="bg-white/20">
                            AI-Powered
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Section Components
const TrendingSection: React.FC<SectionProps> = ({ isLoading }) => {
    const router = useRouter();
    const [currentTrack, setCurrentTrack] = useState<typeof trendingSongs[0] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = (song: typeof trendingSongs[0]) => {
        if (currentTrack?.id === song.id) {
            // If clicking the same song, toggle play/pause
            setIsPlaying(!isPlaying);
            MusicPlayer.togglePlayPause();
        } else {
            // If new song, set current track and start playing
            setCurrentTrack(song);
            setIsPlaying(true);
            MusicPlayer.play({
                id: song.id,
                title: song.title,
                artist: song.artist,
                coverArt: song.coverArt,
                audioUrl: song.audioUrl // Assuming this exists in your song object
            });
        }
    };

    return (
        <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                Trending Music
            </h2>

            <Card className="overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Trending Now</CardTitle>
                        <div className="flex items-center space-x-4 ">
                            <Tabs defaultValue="all" className="w-[400px]">
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="electronic">Electronic</TabsTrigger>
                                    <TabsTrigger value="pop">Pop</TabsTrigger>
                                    <TabsTrigger value="rock">Rock</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/trending')}
                            >
                                View All <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                {isLoading ? (
                    <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full" />
                ) : (
                    <CardContent className="p-2 sm:p-4">
                        <Swiper
                            modules={[Navigation, Keyboard]}
                            spaceBetween={10}
                            slidesPerView={1.2}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 10 },
                                480: { slidesPerView: 2, spaceBetween: 15 },
                                640: { slidesPerView: 2.5, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            navigation={true}
                            keyboard={{ enabled: true }}
                            className="px-2 sm:px-4"
                        >
                            {trendingSongs.map((song) => (
                                <SwiperSlide key={song.id}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative group rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={song.coverArt}
                                            alt={song.title}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-black/50"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Button
                                                                variant="secondary"
                                                                size="icon"
                                                                className="w-10 h-10 sm:w-12 sm:h-12"
                                                                onClick={() => handlePlayPause(song)}
                                                            >
                                                                {currentTrack?.id === song.id && isPlaying ? (
                                                                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                ) : (
                                                                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs sm:text-sm">
                                                                {currentTrack?.id === song.id && isPlaying ? 'Pause' : 'Preview Track'}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <div className="flex items-center space-x-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="w-7 h-7 sm:w-8 sm:h-8"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Implement like functionality
                                                                    }}
                                                                >
                                                                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs sm:text-sm">Add to Favorites</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="w-7 h-7 sm:w-8 sm:h-8"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Implement share functionality
                                                                    }}
                                                                >
                                                                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs sm:text-sm">Share Track</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                </div>
                                        </motion.div>
                                        <div className="p-2 sm:p-4">
                                            <h3 className="font-medium text-sm sm:text-base truncate">{song.title}</h3>
                                            <p className="text-xs sm:text-sm text-gray-400 truncate">{song.artist}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        {song.views}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        {song.likes}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                                    {song.genre}
                                                </Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

const WeeklyChallenge: React.FC<SectionProps> = ({ isLoading }) => (
    <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-8 h-8" />
            Weekly Challenge
        </h2>
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardHeader>
                <CardTitle>Weekly Music Challenge</CardTitle>
            </CardHeader>
            {isLoading ? (
                <CardContent className="p-8">
                    <Skeleton className="h-8 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardContent>
            ) : (
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">This Week&apos;s Theme:</h3>
                            <p className="text-lg mb-4">Create a summer-inspired lofi track</p>
                            <div className="space-y-2">
                                <p className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    256 Participants
                                </p>
                                <p className="flex items-center">
                                    <Star className="w-4 h-4 mr-2" />
                                    Top Prize: $50
                                </p>
                            </div>
                            <Button className="mt-4 bg-white text-purple-600 hover:bg-white/90">
                                Join Challenge
                            </Button>
                        </div>
                        <div className="relative">
                            <img
                                src="/challenge-banner.jpg"
                                alt="Challenge Banner"
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <Button size="sm" variant="secondary">
                                    View Submissions
                                </Button>
                                <Button size="sm" variant="secondary">
                                    Rules
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    </div>
);

//  Artists Section with dynamic follow functionality
const ArtistsSection: React.FC<SectionProps> = ({ isLoading }) => {
    const [followedArtists, setFollowedArtists] = useState<Set<number>>(new Set());
    const router = useRouter(); // Initialize router here

    const handleFollow = (artistId: number) => {
        setFollowedArtists(prev => {
            const newSet = new Set(prev);
            if (newSet.has(artistId)) {
                newSet.delete(artistId);
            } else {
                newSet.add(artistId);
            }
            return newSet;
        });
    };

    return (
        <Card className="p-2 sm:p-4 md:p-6">
            <CardHeader className="p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl">Creators You May Like</CardTitle>
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push('/artists')}
                        className="w-full sm:w-auto"
                    >
                        View All Artists
                    </Button>
                </div>
            </CardHeader>
            {isLoading ? (
                <div className="space-y-4 p-4">
                    <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                </div>
            ) : (
                <CardContent className="p-2 sm:p-4">
                    <Swiper
                        modules={[Navigation, Keyboard]}
                        spaceBetween={10}
                        slidesPerView={1.2}
                        breakpoints={{
                            320: { slidesPerView: 1.2, spaceBetween: 10 },
                            480: { slidesPerView: 2.2, spaceBetween: 15 },
                            640: { slidesPerView: 3, spaceBetween: 15 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1280: { slidesPerView: 5, spaceBetween: 20 },
                        }}
                        navigation={true}
                        keyboard={{ enabled: true }}
                        className="px-2 sm:px-4"
                    >
                        {popularArtists.map((artist) => (
                            <SwiperSlide key={artist.id}>
                                <motion.div
                                    className="relative text-center space-y-2 sm:space-y-4 p-2"
                                >
                                    <div className="relative">
                                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto">
                                            <AvatarImage src={artist.avatar} alt={artist.name} />
                                            <AvatarFallback>{artist.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-medium text-base sm:text-lg truncate px-2">{artist.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-400">{artist.followers} followers</p>
                                        <p className="text-xs text-gray-400 mt-1 truncate px-2">Popular: {artist.popularTrack}</p>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-2"
                                    >
                                        <Button
                                            variant={followedArtists.has(artist.id) ? "secondary" : "outline"}
                                            size="sm"
                                            className="w-full text-xs sm:text-sm"
                                            onClick={() => handleFollow(artist.id)}
                                        >
                                            {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CardContent>
            )}
        </Card>
    );
};

const TutorialSection: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => {
    return (
        <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <PlaySquare className="w-8 h-8" />
                Tutorial Videos
            </h2>

            <Card className="overflow-hidden">
                {isLoading ? (
                    <div className="p-4">
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : (
                    <CardContent className="p-4">
                        <section className="container mx-auto py-8">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                                navigation
                                pagination={{ clickable: true }}
                                className="tutorial-swiper"
                            >
                                {tutorials.map((tutorial) => (
                                    <SwiperSlide key={tutorial.id}>
                                        <div className="bg-gray-900 rounded-lg overflow-hidden h-[400px]">
                                            <motion.div
                                                className="relative aspect-video bg-purple-800/30 overflow-hidden group"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <img
                                                    src={tutorial.thumbnail}
                                                    alt={tutorial.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <motion.div
                                                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Play className="w-12 h-12 text-white" />
                                                </motion.div>
                                            </motion.div>

                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 truncate">
                                                    {tutorial.title}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                                    {tutorial.description}
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={tutorial.author.avatar}
                                                        alt={tutorial.author.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">{tutorial.author.name}</p>
                                                        <p className="text-xs text-gray-400">{tutorial.author.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </section>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

const CategorySection: React.FC<CategorySectionProps> = ({ title, icon, features, onClick, isLoading }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
            {icon}
            <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
                <FeatureCard
                    key={feature.title}
                    feature={feature}
                    onClick={onClick}  // Pass the handler here
                    isLoading={isLoading}
                />
            ))}
        </div>
    </div>
);

// Main Component (continued)
const EnhancedFeatureGrid = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    const handleNavigation = (path: string) => {
        router.push(path);
    };
    const renderFeaturedProjects = () => (
        <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        {isLoading ? (
                            <div className="p-4">
                                <Skeleton className="h-48 w-full mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : (
                            <CardContent className="p-4">
                                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-500 rounded-md mb-4" />
                                <h3 className="font-semibold mb-1">Amazing Project {i + 1}</h3>
                                <p className="text-sm text-gray-500">By Creator {i + 1}</p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderWritingPrompts = () => (
        <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-8 h-8" />
                Daily Writing Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className={`bg-gradient-to-r ${i === 0 ? 'from-blue-600 to-indigo-600' : 'from-purple-600 to-pink-600'}`}>
                        {isLoading ? (
                            <CardContent className="p-8">
                                <Skeleton className="h-8 w-1/2 mb-4" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        ) : (
                            <CardContent className="p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Writing Prompt {i + 1}</h3>
                                <p>
                                    {i === 0
                                        ? 'Create a story about a time traveler who can only go 24 hours into the future'
                                        : 'Create a story about a detective who can read the memories of houses'}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderCollaborativeProjects = () => (
        <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-8 h-8" />
                Collaborative Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        {isLoading ? (
                            <div className="p-4">
                                <Skeleton className="h-40 w-full mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : (
                            <CardContent className="p-4">
                                <div className="h-40 bg-gradient-to-br from-green-500 to-teal-500 rounded-md mb-4" />
                                <h3 className="font-semibold mb-1">Community Story {i + 1}</h3>
                                <p className="text-sm text-gray-500">12 contributors</p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <LampContainer>
                    <section className="container mx-auto w-full py-20 text-center flex flex-col items-center">
                        <motion.h1
                            className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mt-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Create Magic with AI
                        </motion.h1>
                        <motion.p
                            className="text-xl text-muted-foreground max-w-2xl pt-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Unleash your creativity with AI-powered tools - where innovation meets imagination, and every creation tells a unique story
                        </motion.p>
                    </section>
                </LampContainer>

                <div className="container mx-auto space-y-12 py-12">
                    {/* Music Section */}
                    <div className="bg-black/20 rounded-xl p-8 mb-16">
                        <CategorySection
                            title="Music Creation"
                            icon={<Music className="w-8 h-8" />}
                            features={features.music}
                            onClick={handleNavigation}  // Pass the handler here
                            isLoading={isLoading}
                        />
                        <TrendingSection isLoading={isLoading} />
                        <WeeklyChallenge isLoading={isLoading} />
                        <ArtistsSection isLoading={isLoading} />
                    </div>

                    {/* Video Section */}
                    <div className="bg-black/20 rounded-xl p-8 mb-16">
                        <CategorySection
                            title="Video & Image"
                            icon={<Video className="w-8 h-8" />}
                            features={features.video}
                            onClick={handleNavigation}
                            isLoading={isLoading}
                        />
                        <TutorialSection isLoading={isLoading} />
                        {renderFeaturedProjects()}
                    </div>

                    {/* Text & Stories Section */}
                    <div className="bg-black/20 rounded-xl p-8">
                        <CategorySection
                            title="Text & Stories"
                            icon={<Type className="w-8 h-8" />}
                            features={features.text}
                            onClick={handleNavigation}
                            isLoading={isLoading}
                        />
                        {renderWritingPrompts()}
                        {renderCollaborativeProjects()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EnhancedFeatureGrid;