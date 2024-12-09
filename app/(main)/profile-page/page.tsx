'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input2";
import { Label } from "@/components/ui/label2";
import { Layout } from "@/components/layout/layout"
import {
    AudioLines,
    Edit,
    AudioLinesIcon,
    ChevronDown,
    Image,
    Share,
    TriangleAlert,
    User2Icon,
    UserCircleIcon,
    Video,
    X,
    Camera,
    User2
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EnhancedMusicPlayer from '@/components/media/music-player';
import { Badge } from '@/components/ui/badge';
import ScrollingText from '@/components/ui/scroll-text';

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
    songLyrics: string;
};

interface ProfileData {
    profileImage: string;
    bannerImage: string;
    channelName: string;
    channelHandle: string;
    channelDescription: string;
}

interface Song {
    id: string;
    title: string;
    genres: string[];
    coverArt: string;
    audioUrl: string;
    duration: number;
    timestamp: string;
    lyrics: string;
}

// Type-safe storage helper functions
const getFromStorage = (key: string): string => {
    try {
        const item = localStorage.getItem(key);
        return item || '';
    } catch {
        return '';
    }
};

const setInStorage = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

interface Category {
    id: number;
    content: string;
    contentType: string;
}

const ProfilePage = () => {
    const [activeCategory, setActiveCategory] = useState('');
    const [videoModal, setVideoModal] = useState<boolean>(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
    const [currentVideoContent, setCurrentVideoContent] = useState<ContentItem | null>(null)
    const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
    const [showMessageDialog, setShowMessageDialog] = useState<boolean>(false);
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string>(getFromStorage('profileImage'));
    const [bannerImage, setBannerImage] = useState<string>(getFromStorage('bannerImage'));
    const [channelName, setChannelName] = useState<string>(getFromStorage('channelName'));
    const [channelHandle, setChannelHandle] = useState<string>(getFromStorage('channelHandle'));
    const [channelDescription, setChannelDescription] = useState<string>(getFromStorage('channelDescription'));
    const [channelLinks, setChannelLinks] = useState<{ [key: string]: string }>({});
    const [channelContactInfo, setChannelContactInfo] = useState<string | null>(null);
    const [videoWatermark, setVideoWatermark] = useState<string | null>(null);
    const videoModalRef = useRef<HTMLDivElement>(null)

    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
    const currentSong: Song | null = currentSongIndex !== null ? generatedSongs[currentSongIndex] : null;
    const playerScreenRef = useRef<HTMLDivElement>(null)
    const [isMusicPlayerFullScreen, setIsMusicPlayerFullScreen] = useState<boolean>(false)

    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [musicUrl, setMusicUrl] = useState<string | null>(null)

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [volume, setVolume] = useState<number>(0.7);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isRepeat, setIsRepeat] = useState<boolean>(false);

    const [localStorageInstance, setLocalStorageInstance] = useState<Storage | null>(null)

    const categories = [
        { id: 1, contentType: '', content: 'All' },
        { id: 2, contentType: 'roast-my-pic', content: 'Roast My Pic' },
        { id: 3, contentType: 'jukebox', content: 'Jukebox' },
        { id: 4, contentType: 'kids-music', content: 'Kids Music' },
        { id: 5, contentType: 'story-time', content: 'Story Time' },
    ];

    const [data, setData] = useState<ContentItem[]>([]);

    const filteredData = activeCategory
        ? data.filter((dataItem) => dataItem.contentType === activeCategory)
        : data;

    const playGeneratedSong = (content: ContentItem) => {
        if (!isPlaying) {
            const newSong: Song = {
                id: content._id,
                title: content.musicTitle || 'No Title Found',
                genres: ['test', 'test'],
                audioUrl: content.audioUrl || '',
                coverArt: content.imageUrl || content.thumbnail_alt || '',
                duration: audioRef.current?.duration || 180,
                timestamp: new Date().toISOString(),
                lyrics: content.songLyrics || 'No Lyrics Found'
            };

            setGeneratedSongs(prev => [newSong, ...prev]);
            setCurrentSongIndex(0)

            audioRef.current?.play()
        } else {
            audioRef.current?.pause()
        }
    }

    const openVideoModal = (videourl: string, videoContent: ContentItem) => {
        setGeneratedSongs([])
        setCurrentVideoUrl(videourl);
        setCurrentVideoContent(videoContent)
        setVideoModal(true);
    }

    const closeVideoModal = () => {
        setCurrentVideoUrl(null);
        setCurrentVideoContent(null)
        setVideoModal(false);
    }

    function formatDateTime(isoDate: string): string {
        const date = new Date(isoDate);

        // Format the date to a readable string
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short"
        };

        return date.toLocaleString("en-US", options);
    }

    function openLink(url: string): void {
        if (!url) {
            console.error("URL is required to open a link in a new tab.");
            return;
        }

        const newTab = window.open(url, "_blank");

        if (!newTab) {
            console.error("Failed to open the link in a new tab. It may have been blocked by the browser.");
        }
    }

    const handleDownloadAudio = async (audioUrl: string | null, displayName: string) => {
        if (audioUrl) {
            try {
                const response = await axios.get(audioUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${displayName}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading audio:", error);
            }
        }
    };

    const handleDownloadVideo = async (videoUrl: string | null, displayName: string) => {
        if (videoUrl) {
            try {
                const response = await axios.get(videoUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${displayName}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading video:", error);
            }
        }
    };

    const handleDownloadImage = async (imageUrl: string | null, displayName: string) => {
        if (imageUrl) {
            try {
                const response = await axios.get(imageUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'image/png' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${displayName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading image:", error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window !== 'undefined') {
                setLocalStorageInstance(window.localStorage);
                const token = window.localStorage.getItem('token');

                try {
                    const response = await axios.get(
                        `${BASE_URL}/api/content/get-user-content`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                        }
                    );
                    console.log(response.data);
                    setData(response.data);
                } catch (error) {
                    console.error("Error fetching content data:", error);
                }
            }
        };

        fetchData();
    }, [BASE_URL]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (videoModalRef.current && !videoModalRef.current.contains(event.target as Node)) {
                closeVideoModal();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [closeVideoModal])

    useEffect(() => {
        setShowMessageDialog(true)
    }, [])

    const formatTime = (time: number | null): string => {
        if (time === null || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update the handlers with type-safe storage
    const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setInStorage('profileImage', imageUrl);
        }
    };

    const handleBannerImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setBannerImage(imageUrl);
            setInStorage('bannerImage', imageUrl);
        }
    };

    const handleChannelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChannelName(value);
        setInStorage('channelName', value);
    };

    const handleChannelHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChannelHandle(value);
        setInStorage('channelHandle', value);
    };

    const handleChannelDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setChannelDescription(value);
        setInStorage('channelDescription', value);
    };

    const handleSaveProfile = () => {
        setInStorage('profileImage', profileImage);
        setInStorage('bannerImage', bannerImage);
        setInStorage('channelName', channelName);
        setInStorage('channelHandle', channelHandle);
        setInStorage('channelDescription', channelDescription);
        setShowProfileOptions(false);
    };

    // For displaying subscriber count with type safety:
    const subscriberCount = getFromStorage('subscribers') || '136';


    return (
        <Layout>
            <div className="w-full bg-neutral-900 min-h-screen">
                {/* Banner Section */}
                <div className="relative w-full">
                    <div className="w-full h-[200px] relative">
                        {(() => {
                            const bannerSrc = localStorageInstance?.getItem('bannerImage');
                            return bannerSrc ? (
                                <img
                                    src={bannerSrc}
                                    alt="Channel Banner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-800" />
                            );
                        })()}
                    </div>

                    {/* Profile Section */}
                    <div className="mx-auto px-6">
                        <div className="relative -mt-16 pb-4 flex items-end gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="size-32 md:size-40 rounded-full border-4 border-neutral-900 bg-neutral-800 overflow-hidden">
                                    {(() => {
                                        const profileSrc = localStorageInstance?.getItem('profileImage');
                                        return profileSrc ? (
                                            <img
                                                src={profileSrc}
                                                alt="Profile"
                                                className="size-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <User2Icon className="size-full p-6 text-white" />
                                        );
                                    })()}
                                </div>
                                <button
                                    className="absolute bottom-0 right-0 size-8 bg-neutral-900 rounded-full p-2 hover:scale-105 duration-300 cursor-pointer border border-white"
                                    onClick={() => setShowProfileOptions(true)}
                                >
                                    <Edit className="size-full text-white" />
                                </button>
                            </div>

                            {/* Channel Info */}
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                                    {localStorageInstance?.getItem('loggedInUser') || 'Channel Name'}
                                </h1>
                                <div className="flex flex-col md:flex-row gap-2 text-gray-400">
                                    <span className="text-sm">
                                        @{localStorageInstance?.getItem('loggedInUserEmail')}
                                    </span>
                                    <span className="text-sm">
                                        {localStorageInstance?.getItem('subscribers') || '136'} subscribers
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <ScrollArea className="w-full border-b border-neutral-700 mt-4">
                            <div className="flex gap-2 py-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.contentType)}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category.contentType
                                            ? 'bg-white text-neutral-900'
                                            : 'text-white hover:bg-neutral-800'
                                            }`}
                                    >
                                        {category.content}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Profile Settings Modal */}
                {showProfileOptions && (
                    <div className="fixed inset-0 bg-neutral-900/80 flex justify-center items-center z-50">
                        <Card className="p-6 w-full max-w-2xl">
                            <div className="flex justify-end mb-4">
                                <button className="p-2 rounded-full hover:bg-neutral-800" onClick={() => setShowProfileOptions(false)}>
                                    <X className="size-6 text-white" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Profile Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="md:size-36 border-2 border-white rounded-full overflow-hidden">
                                            {profileImage ? (
                                                <img src={profileImage} alt="Profile" className="size-full object-cover" />
                                            ) : (
                                                <User2 className="size-full p-6 text-white" />
                                            )}
                                        </div>
                                        <Label
                                            htmlFor="profile-image"
                                            className="absolute bottom-2 right-2 bg-neutral-800 hover:bg-neutral-700 size-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                                        >
                                            <Camera className="size-4 text-white" />
                                            <input type="file" id="profile-image" className="hidden" onChange={handleProfileImageUpload} />
                                        </Label>
                                    </div>
                                </div>
                                <div className="relative">
                                    {bannerImage ? (
                                        <div className="relative">
                                            <img src={bannerImage} alt="Banner" className="w-full h-36 object-cover rounded-md" />
                                            <Label
                                                htmlFor="banner-image"
                                                className="absolute bottom-2 right-2 bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                                            >
                                                <Camera className="size-4 text-white" />
                                                <input type="file" id="banner-image" className="hidden" onChange={handleBannerImageUpload} />
                                            </Label>
                                        </div>
                                    ) : (
                                        <div className="w-full h-36 rounded-md border-2 border-white flex flex-col items-center justify-center text-white relative">
                                            <Label
                                                htmlFor="banner-image"
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <Camera className="size-6 mb-2" />
                                                Add banner image
                                                <input type="file" id="banner-image" className="hidden" onChange={handleBannerImageUpload} />
                                            </Label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Label htmlFor="channel-name" className="text-lg font-bold text-white">
                                        Channel Name
                                    </Label>
                                    <Input
                                        type="text"
                                        id="channel-name"
                                        className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-md w-full"
                                        value={channelName || ''}
                                        onChange={handleChannelNameChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="channel-handle" className="text-lg font-bold text-white">
                                        Channel Handle
                                    </Label>
                                    <Input
                                        type="text"
                                        id="channel-handle"
                                        className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-md w-full"
                                        value={channelHandle || ''}
                                        onChange={handleChannelHandleChange}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="channel-description" className="text-lg font-bold text-white">
                                    Channel Description
                                </Label>
                                <textarea
                                    id="channel-description"
                                    className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-md w-full resize-none"
                                    rows={3}
                                    value={channelDescription || ''}
                                    onChange={handleChannelDescriptionChange}
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button className="bg-white text-neutral-900 hover:bg-neutral-200 px-4 py-2 rounded-md" onClick={handleSaveProfile}>
                                    Save Profile
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Videos Grid */}
                <div className={`grid grid-cols-1 ${filteredData.length !== 0 && 'sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'} gap-4 p-4`}>
                    {filteredData.length !== 0 ?
                        filteredData.map((dataItem) => (
                            <Card key={dataItem._id} className="border-0 shadow-none ">
                                {
                                    dataItem.status === 'success' ?
                                        (
                                            !(dataItem.contentType === 'jukebox' || dataItem.contentType === 'kids-music') ?
                                                <CardContent
                                                    onClick={() => { openVideoModal(`${BASE_URL}/${dataItem.videoUrl}`, dataItem) }}
                                                    className="bg-[#0f0f0f] w-fit/ h-fit min-h-80 w-full p-0 flex flex-col justify-between pb-4 rounded-xl relative">
                                                    <Badge className='absolute top-2 left-2 z-10'> {dataItem.contentType} </Badge>
                                                    {/* Thumbnail Container */}
                                                    <div className="relative">
                                                        <img
                                                            src={(dataItem.imageUrl || dataItem.thumbnail_alt) ? `${BASE_URL}/${dataItem.imageUrl || dataItem.thumbnail_alt}` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'}
                                                            alt={dataItem.displayName || dataItem.musicTitle || ''}
                                                            className={`w-full h-60 rounded-xl /aspect-video ${dataItem.contentType === 'roast-my-pic' ? 'object-contain bg-black' : 'object-cover'}`}
                                                        />
                                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-sm rounded">
                                                            {/* {video.duration} */}
                                                        </div>
                                                    </div>

                                                    {/* Video Info */}
                                                    <div className="mt-3 flex items-center gap-3 mx-4 overflow-y-visible overflow-x-hidden">
                                                        <div className='size-8'>
                                                            <UserCircleIcon className=" size-full" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold line-clamp-2 text-nowrap">
                                                                {dataItem.contentType === 'story-time' ? dataItem.userPrompt || dataItem.displayName : dataItem.displayName || 'AI Generated Video'}
                                                            </h3>
                                                            <h3 className="font-semibold text-sm text-neutral-400 line-clamp-2 text-nowrap">
                                                                {dataItem.userName || 'AI Generated Video'}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                :
                                                <CardContent
                                                    className="bg-[#0f0f0f] w-fit/ h-fit min-h-80 w-full p-0 flex flex-col justify-between pb-4 rounded-xl relative">
                                                    {/* <div className='h-full w-full p-0'> */}
                                                    <Badge className='absolute top-2 left-2 z-10'> {dataItem.contentType} </Badge>
                                                    <div className='w-full bg-neutral-900 max-h-60 relative flex flex-row justify-around items-center px-8 py-12 rounded-xl'>
                                                        <div className={`relative h-full/ size-36 /w-full flex justify-center items-center group cursor-pointer`}>
                                                            <div
                                                                style={{
                                                                    backgroundImage: (dataItem.imageUrl || dataItem.thumbnail_alt) ? `url('${BASE_URL}/${dataItem.imageUrl || dataItem.thumbnail_alt}')` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg',
                                                                    filter: "blur(14px)",
                                                                    opacity: 0.5,
                                                                }}
                                                                className='top-2 left-1 z-10 group-hover:scale-105 duration-300 absolute size-36 bg-cover rounded-full' >
                                                            </div>
                                                            <div
                                                                style={{
                                                                    backgroundImage: (dataItem.imageUrl || dataItem.thumbnail_alt) ? `url('${BASE_URL}/${dataItem.imageUrl || dataItem.thumbnail_alt}')` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg',
                                                                    animation: currentSong?.id === dataItem._id ? 'slowRotate 15s linear infinite' : '',
                                                                }}
                                                                className='group-hover:scale-105 relative z-20 opacity-90 duration-300 group-hover:opacity-100 size-36 flex flex-col bg-cover justify-center items-center rounded-full'>
                                                                <style>
                                                                    {`
                                                        @keyframes slowRotate {
                                                            from {
                                                                transform: rotate(0deg);
                                                            }
                                                            to {
                                                                transform: rotate(360deg);
                                                            }
                                                        }
                                                    `}
                                                                </style>
                                                                <div className='size-8 bg-neutral-900/60 flex justify-center items-center rounded-full backdrop-blur' >
                                                                    {currentSong?.id === dataItem._id && <AudioLines />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full items-center justify-center text-center text-nowrap bg-neutral-/800 rounded-xl p-4 max-w-48 overflow-hidden whitespace-nowrap flex flex-col gap-2">
                                                            {/* <h3 className="text-white animate-marquee inline-block text-md">{`${dataItem.musicTitle}`}</h3> */}
                                                            <ScrollingText text={dataItem.musicTitle || "Jukebox Music"} />
                                                            <p className="text-gray-200 text-xs">Vibe Vision Music.</p>
                                                            <div onClick={() => playGeneratedSong(dataItem)} className='p-2 cursor-pointer hover:scale-105 duration-300'>
                                                                {currentSong?.id !== dataItem._id ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                                    </svg>
                                                                    :
                                                                    // <PauseCircleIcon className='size-10' />
                                                                    <div className='flex flex-col justify-center items-center'>
                                                                        {/* /* From Uiverse.io by ClawHack1  */}
                                                                        <div className="now-playing">
                                                                            <div className="now-playing-inner">
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                                <div className="now-playing-block"></div>
                                                                            </div>
                                                                        </div>

                                                                        Now Playing
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-3 mx-4 overflow-y-visible overflow-x-hidden">
                                                        <div className='size-8'>
                                                            <UserCircleIcon className=" size-full" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold line-clamp-2 text-nowrap">
                                                                {dataItem.displayName || dataItem.musicTitle || ((dataItem.contentType === 'kids-music' || dataItem.contentType === 'jukebox') ? 'AI Generated Music' : 'AI Generated Video')}
                                                            </h3>
                                                            <h3 className="font-semibold text-sm text-neutral-400 line-clamp-2 text-nowrap">
                                                                {dataItem.userName || 'AI Generated Video'}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                        )
                                        :
                                        dataItem.status === 'waiting' ?
                                            (
                                                <CardContent
                                                    className="bg-[#0f0f0f]/ bg-blue-900/30 border-2 border-blue-600 w-fit/ h-fit min-h-80 w-full p-0 flex flex-col justify-center pb-4 rounded-xl relative">
                                                    <Badge className='absolute top-2 left-2 z-10'> {dataItem.contentType} </Badge>
                                                    <div className="text-center">
                                                        <div
                                                            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"
                                                        ></div>
                                                        <h2 className="text-zinc-900 dark:text-white mt-4">Processing...</h2>
                                                        <p className="text-zinc-600 dark:text-zinc-400">
                                                            Your {dataItem.contentType} is being generated...
                                                        </p>
                                                        <div className='pt-1 text-xs opacity-40'>{dataItem.userPrompt}</div>
                                                    </div>
                                                    {
                                                        dataItem.contentType === 'roast-my-pic' &&
                                                        (
                                                            <img
                                                                src={(dataItem.imageUrl || dataItem.thumbnail_alt) ? `${BASE_URL}/${dataItem.imageUrl || dataItem.thumbnail_alt}` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'}
                                                                alt={dataItem.displayName || dataItem.musicTitle || ''}
                                                                className={`size-24 aspect-square rounded-xl object-cover absolute bottom-4 right-4 hidden`}
                                                            />
                                                        )
                                                    }
                                                </CardContent>
                                            )
                                            :
                                            (
                                                <CardContent
                                                    className="bg-[#0f0f0f]/ bg-red-900/30 border-2 border-red-600 w-fit/ h-fit min-h-80 w-full p-0 flex flex-col justify-center pb-4 rounded-xl relative">
                                                    <Badge className='absolute top-2 left-2 z-10'> {dataItem.contentType} </Badge>
                                                    <div className="text-center">
                                                        <TriangleAlert className='size-16 text-red-500 mx-auto' />
                                                        <h2 className="text-zinc-900 dark:text-white mt-4">Error Generating Content!</h2>
                                                        <p className="text-zinc-600 dark:text-zinc-400">
                                                            The server wasn't able to generate your {dataItem.contentType}!
                                                        </p>
                                                        <div className='pt-1 text-sm opacity-60'>Please Try Again!</div>
                                                        <div className='pt-1 text-xs opacity-40'>{dataItem.userPrompt}</div>
                                                    </div>
                                                    {
                                                        dataItem.contentType === 'roast-my-pic' &&
                                                        (
                                                            <img
                                                                src={(dataItem.imageUrl || dataItem.thumbnail_alt) ? `${BASE_URL}/${dataItem.imageUrl || dataItem.thumbnail_alt}` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'}
                                                                alt={dataItem.displayName || dataItem.musicTitle || ''}
                                                                className={`size-24 aspect-square rounded-xl object-cover absolute bottom-4 right-4 hidden`}
                                                            />
                                                        )
                                                    }
                                                </CardContent>
                                            )
                                }
                                {
                                }
                            </Card>
                        ))
                        :
                        (
                            <div className='flex flex-col w-full items-center justify-start pt-16 gap-4 text-gray-300 h-96'>
                                <img className='size-20 opacity-60' src="https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/external-mount-fuji-wonder-of-the-world-vitaliy-gorbachev-blue-vitaly-gorbachev.png" alt="external-mount-fuji-wonder-of-the-world-vitaliy-gorbachev-blue-vitaly-gorbachev" />
                                Nothing to see here
                            </div>
                        )
                    }
                </div>

                {videoModal &&
                    (
                        <div className="fixed z-50 h-screen w-screen p-0 xl:px-44 xl:py-20 top-0 left-0 bg-black/20 backdrop-blur flex justify-center items-center">
                            <div ref={videoModalRef} className="relative bg-neutral-900 p-4 pt-12 xl:p-8 gap-4 xl:gap-8 w-full h-full xl:rounded-xl flex flex-col xl:flex-row justify-center items-center object-contain">
                                <Button className="absolute bg-neutral-900 xl:bg-transparent xl:w-8 xl:h-8 z-10 top-2 right-2" onClick={closeVideoModal}>
                                    <ChevronDown className='flex xl:hidden' />
                                    <X className='xl:flex hidden' />
                                </Button>
                                <video src={currentVideoUrl || ''} controls className="xl:h-full xl:max-w-96 max-h-96 xl:max-h-full rounded-xl object-contain"></video>
                                <ScrollArea className='flex-1 h-full rounded-xl'>
                                    <div className='flex flex-col gap-4 bg-neutral-950 rounded-xl h-full p-4 xl:p-8'>
                                        <h1 className='text-2xl'>Video Description</h1>
                                        <div className='flex flex-col 2xl:flex-row py-4 items-start justify-between'>
                                            <div className='text-xl'>{(currentVideoContent?.contentType === 'story-time' ? currentVideoContent?.userPrompt : currentVideoContent?.displayName) || 'Video Name'}</div>
                                            <div className='text-lg opacity-60'>{formatDateTime(currentVideoContent?.createdAt || '00:00:00')}</div>
                                        </div>
                                        <div className='text-lg bg-neutral-900 p-4 rounded-xl'>User Prompt <br /> {currentVideoContent?.userPrompt || 'no prompt'}</div>
                                        <div className='text-lg bg-neutral-900 p-4 rounded-xl'>Generated Text<br /> {currentVideoContent?.enhancedPrompt || 'no prompt'}</div>
                                        <div className="gap-4 flex flex-auto flex-col xl:flex-row w-full">
                                            {currentVideoContent?.contentType === 'roast-my-pic' && <div className='p-8 rounded-xl flex flex-col items-center gap-6 bg-neutral-900 w-full'>
                                                Image Used
                                                <img src={`${BASE_URL}/${currentVideoContent?.imageUrl}`} className='size-44 rounded-xl object-cover duration-200 hover:scale-105 cursor-pointer' onClick={() => { openLink(`${BASE_URL}/${currentVideoContent?.imageUrl}`) }} alt="No Image Found" />
                                            </div>}
                                            <div className='flex gap-4 flex-col w-full h-full'>
                                                <Button
                                                    className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl'
                                                    onClick={() => handleDownloadVideo(`${BASE_URL}/${currentVideoContent?.videoUrl || null}`, currentVideoContent?.displayName || 'Roast Video')} >
                                                    <Video className="size-4" />
                                                    Download Video
                                                </Button>
                                                {currentVideoContent?.contentType === 'roast-my-pic' &&
                                                    <>
                                                        <Button
                                                            className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl'
                                                            onClick={() => handleDownloadAudio(`${BASE_URL}/${currentVideoContent?.audioUrl || null}`, currentVideoContent?.displayName || 'Roast Audio')} >
                                                            <AudioLinesIcon className="size-4" />
                                                            Download Audio
                                                        </Button>
                                                        <Button
                                                            className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl'
                                                            onClick={() => handleDownloadImage(`${BASE_URL}/${currentVideoContent?.imageUrl || null}`, currentVideoContent?.displayName || 'Roast Image')} >
                                                            <Image className="size-4" />
                                                            Download Image
                                                        </Button>
                                                    </>
                                                }
                                            </div>
                                            <Button
                                                className='w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl'
                                                onClick={() => setShowShareDialog(true)}
                                            >
                                                <Share className="size-4" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )
                }
                {showShareDialog && (
                    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                        <DialogTrigger>
                            <div className="fixed inset-0 bg-neutral-900/80 flex justify-center items-center z-50">
                                <Card className="bg-neutral-800 p-6 w-full max-w-md">
                                    <div className="flex justify-end mb-4">
                                        <button
                                            className="bg-neutral-700 p-2 rounded-full hover:bg-neutral-600 transition-colors"
                                            onClick={() => setShowShareDialog(false)}
                                        >
                                            <X className="size-6" />
                                        </button>
                                    </div>
                                    <DialogHeader>
                                        <DialogTitle>Share Content</DialogTitle>
                                        <DialogDescription>
                                            Copy the link to share this content.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogContent>
                                        <div className="flex items-center bg-neutral-700 rounded-md p-2">
                                            <input
                                                type="text"
                                                className="bg-transparent flex-1 outline-none text-neutral-300"
                                                value={window.location.href}
                                                readOnly
                                            />
                                            <button
                                                className="bg-neutral-600 text-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-500 transition-colors"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    setShowShareDialog(false);
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </DialogContent>
                                </Card>
                            </div>
                        </DialogTrigger>
                    </Dialog>
                )}

                {showMessageDialog && (
                    <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                        <DialogTrigger>
                            <div className="fixed inset-0 bg-neutral-900/80 flex justify-center items-center z-50">
                                <Card className="bg-neutral-800 p-6 w-full max-w-md">
                                    <div className="flex justify-end mb-4">
                                        <button
                                            className="bg-neutral-700 p-2 rounded-full hover:bg-neutral-600 transition-colors"
                                            onClick={() => setShowMessageDialog(false)}
                                        >
                                            <X className="size-6" />
                                        </button>
                                    </div>
                                    <DialogHeader>
                                        <DialogTitle>Welcome to the Profile Page!</DialogTitle>
                                        <DialogDescription>
                                            This is where you can manage your channel settings and view your generated content.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogContent>
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                setShowMessageDialog(false);
                                                setShowProfileOptions(true);
                                            }}
                                        >
                                            Customize Profile
                                        </Button>
                                    </DialogContent>
                                </Card>
                            </div>
                        </DialogTrigger>
                    </Dialog>
                )}

                {/* Music Player */}
                <EnhancedMusicPlayer currentSong={currentSong || null} />


                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogContent className="bg-black/90 border-purple-500/20">
                        <DialogHeader>
                            <DialogTitle className="text-white">Share Your Story</DialogTitle>
                            <DialogDescription className="text-purple-200">
                                Share your creation across platforms
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'Twitter', icon: '🐦' },
                                { name: 'Facebook', icon: '👤' },
                                { name: 'Reddit', icon: '🤖' },
                                { name: 'Email', icon: '📧' }
                            ].map(platform => (
                                <Button
                                    key={platform.name}
                                    variant="outline"
                                    className="w-full bg-black/30"
                                    onClick={() => setShowShareDialog(false)}
                                >
                                    <span className="mr-2">{platform.icon}</span>
                                    {platform.name}
                                </Button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                    <DialogContent className="bg-black/90 border-purple-500/20">
                        <DialogHeader>
                            <DialogTitle className="text-white text-xl">Attention!</DialogTitle>
                            <DialogDescription className="text-purple-200 text-base">
                                Since the website is in development as of now, your generated content will be deleted from the server when the server gets updated next time.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default ProfilePage;