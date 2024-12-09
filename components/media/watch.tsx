import React, { useRef, useState } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Settings,
    Maximize,
    Minimize,
    Film,
    Clock,
    Send,
    ThumbsUp,
} from 'lucide-react';

// Video Player with Advanced Controls
const VideoPlayerWithControls: React.FC<{
    videoDetails: VideoDetails;
    selectedQuality: string;
    playbackSpeed: number;
    onQualityChange: (quality: string) => void;
    onPlaybackSpeedChange: (speed: number) => void;
    onTimestampChange: (timestamp: number) => void;
}> = ({
    videoDetails,
    selectedQuality,
    playbackSpeed,
    onQualityChange,
    onPlaybackSpeedChange,
    onTimestampChange,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const qualityOptions = [
        { value: 'auto', label: 'Auto' },
        { value: '1080p', label: '1080p' },
        { value: '720p', label: '720p' },
        { value: '480p', label: '480p' },
    ];

    const speedOptions = [0.5, 1, 1.25, 1.5, 2];

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuteState = !isMuted;
            setIsMuted(newMuteState);
            videoRef.current.muted = newMuteState;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!document.fullscreenElement) {
                videoRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            onTimestampChange(videoRef.current.currentTime);
        }
    };

    return (
        <div
            className="relative group video-container"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={videoDetails.videoUrl}
                poster={videoDetails.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full"
            >
                Your browser does not support the video tag.
            </video>

            <div
                className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
                    showControls ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="flex items-center space-x-4 p-4">
                    <button onClick={togglePlay} className="hover:text-purple-500 transition">
                        {isPlaying ? <Pause /> : <Play />}
                    </button>

                    <div className="flex items-center space-x-2">
                        <button onClick={toggleMute}>
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-gray-300 rounded-full appearance-none"
                        />
                    </div>

                    <div className="relative group">
                        <button className="flex items-center hover:text-purple-500">
                            <Settings className="mr-2" />
                            {playbackSpeed}x
                        </button>
                        <div className="absolute bottom-full left-0 hidden group-hover:block bg-black rounded shadow-lg">
                            {speedOptions.map((speed) => (
                                <button
                                    key={speed}
                                    onClick={() => onPlaybackSpeedChange(speed)}
                                    className={`block w-full p-2 text-left hover:bg-purple-500 ${
                                        playbackSpeed === speed ? 'bg-purple-600' : ''
                                    }`}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center hover:text-purple-500">
                            <Film className="mr-2" />
                            {selectedQuality}
                        </button>
                        <div className="absolute bottom-full left-0 hidden group-hover:block bg-black rounded shadow-lg">
                            {qualityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => onQualityChange(option.value)}
                                    className={`block w-full p-2 text-left hover:bg-purple-500 ${
                                        selectedQuality === option.value ? 'bg-purple-600' : ''
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={toggleFullscreen} className="ml-auto hover:text-purple-500">
                        {isFullscreen ? <Minimize /> : <Maximize />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Recommended Videos List
const RecommendedVideosList: React.FC<{ recommendedVideos: RecommendedVideo[] }> = ({
    recommendedVideos,
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recommended Videos</h2>
            {recommendedVideos.map((video) => (
                <div key={video.id} className="flex space-x-4">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 rounded"
                    />
                    <div className="flex-grow">
                        <h3 className="text-md font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-500">
                            {video.userName} • {formatViewCount(video.views)} views
                        </p>
                        <p className="text-sm text-gray-500">{video.duration}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Comments Section
const CommentsSection: React.FC<{ comments: Comment[] }> = ({ comments }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                    <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">{comment.userName}</h3>
                            <span className="text-sm text-gray-500">
                                {formatTimeAgo(comment.timestamp)}
                            </span>
                        </div>
                        <p>{comment.text}</p>
                        <div className="flex space-x-4 mt-2">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-500">
                                <ThumbsUp />
                                <span>{comment.likes}</span>
                            </button>
                            {comment.replies && (
                                <span className="text-gray-500">{comment.replies.length} replies</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Video Player Skeleton
const VideoPlayerSkeleton: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gray-700 w-full aspect-video rounded-lg"></div>
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                        <div className="flex space-x-4">
                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} className="flex space-x-4">
                            <div className="w-24 h-16 bg-gray-700 rounded"></div>
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Utility Functions
const formatViewCount = (views: number): string => {
    if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`;
    }
    if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    }
    return views.toString();
};

const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`;
        }
    }

    return 'just now';
};

// Type Definitions
interface VideoDetails {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    views: number;
    likes: number;
    dislikes: number;
    category: string;
    userName: string;
    userAvatar: string;
    followers: number;
    chapters?: VideoChapter[];
}

interface VideoChapter {
    timestamp: number;
    title: string;
}

interface Comment {
    id: string;
    text: string;
    userName: string;
    userAvatar: string;
    timestamp: string;
    likes: number;
    replies?: Comment[];
}

interface RecommendedVideo {
    id: string;
    title: string;
    thumbnail: string;
    userName: string;
    views: number;
    duration: string;
}

export {
    VideoPlayerWithControls,
    RecommendedVideosList,
    CommentsSection,
    VideoPlayerSkeleton,
    formatViewCount,
    formatTimeAgo,
};
