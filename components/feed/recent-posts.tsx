"use client"
import React, { useState } from 'react';
import { X, ChevronDown, ExternalLink, User } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types/types';

interface RecentPostsWidgetProps {
  posts: Post[];
  communityName?: string;
  maxInitialPosts?: number;
  onPostClick?: (post: Post) => void;
  onUserClick?: (userId: string) => void;
}

export const RecentPosts: React.FC<RecentPostsWidgetProps> = ({ 
  posts, 
  communityName = 'neil',
  maxInitialPosts = 15,
  onPostClick,
  onUserClick
}) => {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>(posts.slice(0, maxInitialPosts));
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (postId: string) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const handleClear = () => {
    setDisplayedPosts([]);
  };

  const toggleShowAllPosts = () => {
    if (showAllPosts) {
      // If currently showing all, revert to initial view
      setDisplayedPosts(posts.slice(0, maxInitialPosts));
      setShowAllPosts(false);
    } else {
      // Show all posts
      setDisplayedPosts(posts);
      setShowAllPosts(true);
    }
  };

  const handlePostClick = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
    } else if (post.url) {
      window.open(post.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUserClick = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent post click event
    if (onUserClick) {
      onUserClick(userId);
    }
  };

  return (
    <Card className="w-[350px] rounded-xl shadow-2xl overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-gray-800">
        <CardTitle className="text-white text-xl font-bold tracking-wider uppercase">
          RECENT POSTS
        </CardTitle>
        {displayedPosts.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center space-x-1"
          >
            <X size={16} />
            <span className="text-xs">Clear</span>
          </button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {displayedPosts.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {displayedPosts.map((post) => (
              <div 
                key={post.id}
                className="block hover:bg-gray-800/50 transition-colors duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="flex p-4 items-start space-x-4 relative">
                  {/* Community Info */}
                  <div 
                    className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer"
                    onClick={(e) => handleUserClick(post.userId || '', e)}
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">
                        {communityName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-200 hover:text-blue-400 transition-colors">
                      {communityName}
                    </span>
                    <User 
                      size={14} 
                      className="text-gray-500 hover:text-blue-300 transition-colors" 
                    />
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 pt-6 space-y-2">
                    <h3 className="text-white font-medium text-base mt-2 line-clamp-2 hover:text-blue-400 transition-colors">
                      {post.title}
                      {post.url && (
                        <ExternalLink 
                          size={14} 
                          className="inline-block ml-2 text-gray-500 hover:text-blue-300" 
                        />
                      )}
                    </h3>
                    
                    {/* Post Stats */}
                    <div className="text-xs text-gray-400 flex space-x-1">
                      <span>{post.likes || '0'} likes</span>
                      <span>·</span>
                      <span>{post.comments || '0'} comments</span>
                      <span>·</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {post.media && post.media[0] && !imageErrors[post.id] && (
                    <div className="relative w-24 h-24 flex-shrink-0 group">
                      <Image
                        src={post.media[0].thumbnail || post.media[0].url}
                        alt={post.title}
                        fill
                        className="object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                        sizes="96px"
                        onError={() => handleImageError(post.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No recent posts
          </div>
        )}
      </CardContent>

      {/* Show More/Less Footer */}
      {posts.length > maxInitialPosts && (
        <CardFooter className="p-0">
          <button 
            onClick={toggleShowAllPosts}
            className="w-full p-3 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <span>
              {showAllPosts 
                ? 'Show Less' 
                : `Show More (${posts.length - maxInitialPosts} more)`
              }
            </span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform duration-300 ${showAllPosts ? 'rotate-180' : ''}`} 
            />
          </button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecentPosts;