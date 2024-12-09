"use client";

import useSWRInfinite from 'swr/infinite';
import type { Post, MediaItem, Author } from '@/types/types';

// Comprehensive media type definitions
const MEDIA_TYPES = ['text', 'image', 'video', 'audio'] as const;
type MediaType = typeof MEDIA_TYPES[number];

// Expanded placeholder media collections
const MEDIA_RESOURCES = {
  image: [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf',
    'https://images.unsplash.com/photo-1480506132646-4a11f1d8a280'
  ],
  video: [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  ],
  audio: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  ],
  text: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.'
  ]
};

// Expanded author profiles
const AUTHORS: Author[] = [
  {
    id: "1",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
  },
  {
    id: "2",
    username: "janedoe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces"
  },
  {
    id: "3",
    username: "techguru",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=faces"
  }
];

// Categories with more specificity
const CATEGORIES = ['technology', 'science', 'entertainment', 'sports', 'lifestyle'] as const;
type Category = typeof CATEGORIES[number];

// Sophisticated media generation function
const generateMediaForType = (type: MediaType): MediaItem => {
  const resources = MEDIA_RESOURCES[type];
  const randomResource = resources[Math.floor(Math.random() * resources.length)];

  switch(type) {
    case 'image':
      return {
        type: 'image',
        url: randomResource,
        thumbnail: randomResource,
        alt: 'Random image'
      };
    case 'video':
      return {
        type: 'video',
        url: randomResource,
        thumbnail: MEDIA_RESOURCES.image[Math.floor(Math.random() * MEDIA_RESOURCES.image.length)],
        alt: 'Random video'
      };
    case 'audio':
      return {
        type: 'audio',
        url: randomResource,
        thumbnail: MEDIA_RESOURCES.image[Math.floor(Math.random() * MEDIA_RESOURCES.image.length)],
        duration: Math.floor(Math.random() * 300) // Random duration in seconds
      };
    case 'text':
    default:
      return {
        type: 'text',
        content: randomResource
      };
  }
};

// Enhanced fetchPosts with more realistic data generation
const fetchPosts = async (page: number, category: Category): Promise<Post[]> => {
  // Simulated network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return Array.from({ length: 10 }, (_, i) => {
    const postType = MEDIA_TYPES[Math.floor(Math.random() * MEDIA_TYPES.length)];

    return {
      id: `${page}-${i}`,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Post ${page}-${i}`,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      category,
      tags: [category, ...(postType === 'technology' ? ['tech', 'innovation'] : [])],
      media: [generateMediaForType(postType)],
      type: postType,
      stats: {
        likes: Math.floor(Math.random() * 1000),
        dislikes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200)
      }
    };
  });
};

export function usePosts(category: Category = 'technology') {
  const getKey = (pageIndex: number) => {
    return [`/api/posts?page=${pageIndex}&category=${category}`, pageIndex, category];
  };

  const { 
    data, 
    error, 
    size, 
    setSize, 
    isLoading, 
    isValidating 
  } = useSWRInfinite(
    getKey, 
    ([_, page, category]) => fetchPosts(page, category), 
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
      // Optional: Add retry logic
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 1000
    }
  );

  const posts = data ? data.flat() : [];
  const isLoadingMore = isLoading || isValidating;

  return {
    posts,
    error,
    isLoadingMore,
    size,
    setSize,
    hasMore: posts.length > 0 && posts.length % 10 === 0
  };
}

export type { MediaType, Category, MediaItem, Post };