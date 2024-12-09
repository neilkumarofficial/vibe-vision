"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown } from "lucide-react";
import { Comment, CommentProps } from "./comment";
import { CommentForm } from "./comment-form";
import { toast } from "sonner";

interface CommentSectionProps {
  comments?: number;
}

export function CommentSection({ }: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentProps[]>([
    {
      id: 1,
      author: "John Doe",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop",
      content: "This is an amazing feature! 🔥 Can't wait to see more improvements.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      likes: 42,
      replies: [
        {
          id: 2,
          author: "Jane Smith",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop",
          content: "Totally agree! The UI looks really clean and intuitive.",
          timestamp: new Date(Date.now() - 1000 * 60 * 2),
          likes: 12,
        },
        {
          id: 3,
          author: "Mike Johnson",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop",
          content: "Nice work on the comment section design!",
          timestamp: new Date(Date.now() - 1000 * 60),
          likes: 5,
        }
      ],
    },
  ]);

  const handleNewComment = (content: string) => {
    const newComment: CommentProps = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop",
      content,
      timestamp: new Date(),
      likes: 0,
      replies: [],
    };
    setCommentsList([newComment, ...commentsList]);
    toast.success("Comment posted successfully!");
  };

  // Determine which comments to show
  const displayComments = showAllComments 
    ? commentsList 
    : commentsList.slice(0, 1);

  // Calculate total comments (including replies)
  const totalComments = commentsList.reduce(
    (total, comment) => total + 1 + (comment.replies?.length || 0), 
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="text-white rounded-full">
            <MessageSquare className="w-6 h-6" />
          </Button>
          <span className="text-sm mt-1">{totalComments}</span>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Comments ({totalComments})</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-4 h-full">
          <CommentForm onSubmit={handleNewComment} />
          
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full pr-4">
              {displayComments.map((comment) => (
                <Comment key={comment.id} {...comment} />
              ))}
              
              {commentsList.length > 1 && !showAllComments && (
                <div className="sticky bottom-0 left-0 right-0 bg-white text-center py-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="text-blue-600"
                    onClick={() => setShowAllComments(true)}
                  >
                    <ChevronDown className="mr-2 w-4 h-4" />
                    Show {commentsList.length - 1} more comment{commentsList.length - 1 === 1 ? '' : 's'}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}