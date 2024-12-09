// src/types/videoPlayerTypes.ts
export interface VideoDetails {
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
    timestamp: string;
}

export interface RecommendedVideo {
    id: string;
    title: string;
    userName: string;
    thumbnail: string;
    views: number;
    duration: string;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
    likes?: number;
    replies?: Comment[];
}

export interface VideoPlayerProps {
    initialVideoId?: string;
}

export type EngagementType = 'like' | 'dislike';

export interface CommentThreadType {
    parentId?: string;
    comment: string;
}