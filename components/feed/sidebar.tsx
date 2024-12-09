"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, FileText, Video, Layout, TrendingUp, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "All", icon: Layout },
  { name: "Music", icon: Music },
  { name: "Text", icon: FileText },
  { name: "Video", icon: Video },
];

const sections = [
  { name: "Trending", icon: TrendingUp },
  { name: "Recent", icon: Clock },
  { name: "Top Posts", icon: Star },
];

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                selectedCategory === name.toLowerCase() && "bg-accent"
              )}
              onClick={() => onCategoryChange(name.toLowerCase())}
            >
              <Icon className="mr-2 h-4 w-4" />
              {name}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Discover</h2>
        <div className="space-y-2">
          {sections.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant="ghost"
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}