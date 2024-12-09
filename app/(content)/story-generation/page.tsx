"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Copy,
  Check,
  BrainCircuit,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { Layout } from '@/components/layout/layout';
import { toast } from 'sonner';
import OpenAI from 'openai';

// Genre type definition
type Genre = {
  value: string;
  icon: string;
  theme: string;
  description: string;
};

const genres: Genre[] = [
  {
    value: 'Fantasy',
    icon: '🧙‍♂️',
    theme: 'from-violet-600 to-indigo-600',
    description: 'Magical worlds and epic adventures'
  },
  {
    value: 'Sci-Fi',
    icon: '🚀',
    theme: 'from-cyan-500 to-blue-600',
    description: 'Futuristic technology and space exploration'
  },
  {
    value: 'Mystery',
    icon: '🔍',
    theme: 'from-slate-600 to-slate-900',
    description: 'Suspenseful investigations and puzzling cases'
  },
  {
    value: 'Romance',
    icon: '💝',
    theme: 'from-pink-500 to-rose-600',
    description: 'Love, relationships, and emotional journeys'
  },
  {
    value: 'Horror',
    icon: '👻',
    theme: 'from-gray-900 to-red-900',
    description: 'Spine-chilling tales and supernatural events'
  },
  {
    value: 'Adventure',
    icon: '🗺️',
    theme: 'from-emerald-600 to-yellow-500',
    description: 'Action-packed journeys and thrilling quests'
  },
  {
    value: 'Fairy Tale',
    icon: '🧚',
    theme: 'from-purple-500 to-pink-500',
    description: 'Enchanting stories of magic, wonder, and happy endings'
  },
  {
    value: 'Slice of Life',
    icon: '🍃',
    theme: 'from-green-400 to-blue-400',
    description: 'Everyday experiences, emotions, and personal growth'
  },
  {
    value: 'Drama',
    icon: '🎭',
    theme: 'from-blue-500 to-gray-700',
    description: 'Emotional narratives with realistic conflicts and character depth'
  },
  {
    value: 'Action',
    icon: '💥',
    theme: 'from-red-600 to-orange-600',
    description: 'High-energy sequences, battles, and heroism'
  }
];

// Story type
type Story = {
  id: string;
  genre: string;
  prompt: string;
  content: string;
  createdAt: string;
};

export default function EnhancedStoryGenerator() {
  // Core state
  const [genre, setGenre] = useState<string>(genres[0].value);
  const [genreDescription, setGenreDescription] = useState<string>(genres[0].description);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [characterLimit] = useState<number>(2000);

  // Story generation settings
  const [settings, setSettings] = useState({
    tone: 'casual',
    ageGroup: 'Kids ( less than 12 )',
  });

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Utility functions
  const handleCopyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Story copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy story');
    }
  };

  // Story generation function
  const generateStory = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a story prompt');
      return;
    }

    setLoading(true);
    try {
      // Construct detailed prompt for ChatGPT
      const fullPrompt = `Write a ${settings.tone} ${genre.toLowerCase()} story for ${settings.ageGroup}. 
      Story Prompt: ${prompt}. 
      Guidelines:
      - Ensure the story is appropriate for the specified age group
      - Maintain a ${settings.tone} tone
      - Story should be engaging and creative
      - Length: Around 300-500 words`;

      // Generate story using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a creative storyteller who generates engaging stories based on specific prompts."
          },
          {
            role: "user", 
            content: fullPrompt
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      const storyContent = completion.choices[0].message.content || 'Story generation failed.';

      const newStory: Story = {
        id: `story-${Date.now()}`,
        genre,
        prompt,
        content: storyContent,
        createdAt: new Date().toISOString()
      };

      // Update stories state
      setStories(prevStories => [newStory, ...prevStories]);
      setGeneratedStory(newStory);
      toast.success('Story generated successfully!');
    } catch (error) {
      console.error('Story generation failed:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic background classes
  const getBackgroundClass = () => {
    const baseClasses = 'transition-all duration-500 ease-in-out';
    return `${baseClasses} bg-gradient-to-br ${genres.find(g => g.value === genre)?.theme || 'from-purple-600 to-blue-600'}`;
  };

  return (
    <Layout>
      <div className={`min-h-screen ${getBackgroundClass()} p-6 overflow-hidden relative`}>
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <BrainCircuit className="h-8 w-8" />
                Story Forge AI
              </h1>
              <Badge variant="outline" className="text-white">
                v1.0
              </Badge>
            </div>
          </header>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel - Story controls */}
            <div className="space-y-6">
              {/* Genre selection */}
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <CardTitle className="text-white">Choose Your Genre</CardTitle>
                  <CardDescription className="text-purple-200">
                    Select a genre to shape your story&apos;s world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {genres.map(({ value, icon, description }) => (
                      <TooltipProvider key={value}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={genre === value ? "default" : "outline"}
                              className={`w-full h-20 flex flex-col items-center justify-center gap-2 ${genre === value
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "hover:bg-purple-500/20"
                                }`}
                              onClick={() => {
                                setGenre(value);
                                setGenreDescription(description);
                              }}
                            >
                              <span className="text-2xl">{icon}</span>
                              <span className="text-sm">{value}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Story Configuration */}
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <CardTitle className="text-white">Story Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tone Selection */}
                  <div className="space-y-4">
                    <Label className="text-purple-200">Tone</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Casual', 'Formal', 'Humorous', 'Dark', 'Sarcastic', 'Hilarious', 'Silly', 'Dark Comedy'].map((tone) => (
                        <Button
                          key={tone}
                          variant="outline"
                          className={`${settings.tone.toLowerCase() === tone.toLowerCase()
                            ? 'bg-purple-600'
                            : 'bg-black/30'
                            }`}
                          onClick={() => setSettings({ ...settings, tone: tone.toLowerCase() })}
                        >
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Age Group Selection */}
                  <div className="space-y-4">
                    <Label className="text-purple-200">Age Group</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Kids ( less than 12 )', 'Teens ( 13 to 18 )', 'Adults ( above 18 )'].map((ageGroup) => (
                        <Button
                          key={ageGroup}
                          variant="outline"
                          className={`${settings.ageGroup.toLowerCase() === ageGroup.toLowerCase()
                            ? 'bg-purple-600'
                            : 'bg-black/30'
                            }`}
                          onClick={() => setSettings({ ...settings, ageGroup: ageGroup.toLowerCase() })}
                        >
                          {ageGroup}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Story Prompt */}
                  <div className="space-y-2">
                    <Label className="text-purple-200">Story Prompt</Label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your story idea..."
                      className="h-32 bg-black/50 resize-none"
                      maxLength={characterLimit}
                    />
                    <div className="flex justify-between text-sm text-purple-300">
                      <span>{prompt.length} / {characterLimit} characters</span>
                      <button
                        className="hover:text-purple-100"
                        onClick={() => setPrompt('')}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Generation Button */}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading || !prompt.trim()}
                    onClick={generateStory}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Crafting Your Story
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right panel - Story Display */}
            <div className="space-y-6">
              <Card className={`${darkMode ? 'bg-black/50' : 'bg-white/90'} backdrop-blur border-purple-500/20`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Your Generated Stories
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[800px] rounded-md border border-purple-500/20 p-4 gap-4">
                    {stories.length > 0 ? (
                      stories.map((story) => (
                        <Card key={story.id} className='p-6 bg-black/30 mb-4'>
                          <div className="prose prose-invert max-w-none py-4 rounded-xl bg-black/60 p-4 mb-4">
                            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex justify-between">
                              Story Prompt
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyToClipboard(story.content)}
                                  className="text-white hover:bg-white/20"
                                >
                                  {copied ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                  </Button>
                              </div>
                            </h2>
                            <p className="text-purple-50 mb-4">{story.prompt}</p>
                            <h3 className="text-xl font-semibold text-purple-100 mb-2">Generated Story</h3>
                            <p className="text-purple-50 whitespace-pre-wrap leading-relaxed pr-4 max-h-96 overflow-y-auto">
                              {story.content}
                            </p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-purple-300 py-20">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Your stories will appear here</p>
                        <p className="text-sm mt-2 text-purple-400">
                          Use the controls on the left to generate your story
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}