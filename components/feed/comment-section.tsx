import React, { useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
    id: string;
    author: {
        username: string;
        avatar: string;
    };
    content: string;
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        // In a real app, this would be an API call
        const commentToAdd: Comment = {
            id: Date.now().toString(),
            author: {
                username: 'CurrentUser', // Replace with actual logged-in user
                avatar: '/default-avatar.png'
            },
            content: newComment,
            createdAt: new Date().toISOString()
        };

        setComments([commentToAdd, ...comments]);
        setNewComment('');
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-4">
                <Avatar className="h-10 w-10">
                    <img src="/default-avatar.png" alt="Current User" />
                </Avatar>
                <div className="flex-grow space-y-2">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full"
                    />
                    <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                    >
                        Post Comment
                    </Button>
                </div>
            </div>

            {comments.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Comments</h3>
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-4 items-start">
                            <Avatar className="h-8 w-8">
                                <img src={comment.author.avatar} alt={comment.author.username} />
                            </Avatar>
                            <div className="flex-grow bg-secondary/50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{comment.author.username}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                                    </span>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;