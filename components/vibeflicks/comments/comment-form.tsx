"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  userAvatar?: string;
  placeholder?: string;
  buttonText?: string;
}

export function CommentForm({
  onSubmit,
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop",
  placeholder = "Add a comment...",
  buttonText = "Comment"
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={userAvatar} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="resize-none"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setContent("")}
            disabled={!content.trim()}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}