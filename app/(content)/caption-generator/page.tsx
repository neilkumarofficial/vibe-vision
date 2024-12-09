"use client";

import React, { useState, useCallback, useMemo } from 'react';
import OpenAI from 'openai';
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import {
  RefreshCcw,
  Copy,
  HelpCircle,
  Wand2,
  Settings2,
  Aperture,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { Layout } from '@/components/layout/layout';
import { SparklesCore } from '@/components/ui/sparkles';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Enhanced type definitions
interface Platform {
  maxLength: number;
  hashtagLimit: number;
  description: string;
}

interface Platforms {
  [key: string]: Platform;
}

interface ToneOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  imageDescription: string;
  timestamp: number;
}

// Comprehensive platform and tone configurations
const platforms: Platforms = {
  instagram: {
    maxLength: 2200,
    hashtagLimit: 30,
    description: "Visual-first platform focusing on aesthetics and storytelling"
  },
  twitter: {
    maxLength: 280,
    hashtagLimit: 5,
    description: "Real-time, concise communication platform"
  },
  facebook: {
    maxLength: 63206,
    hashtagLimit: 10,
    description: "Community and connection-oriented social network"
  },
  linkedin: {
    maxLength: 3000,
    hashtagLimit: 15,
    description: "Professional networking and content sharing platform"
  }
};

const toneOptions: ToneOption[] = [
  {
    value: 'professional',
    label: 'Professional',
    icon: '👔',
    description: 'Polished, formal, and expert-level communication'
  },
  {
    value: 'casual',
    label: 'Casual',
    icon: '😊',
    description: 'Relaxed, conversational, and approachable style'
  },
  {
    value: 'humorous',
    label: 'Humorous',
    icon: '😄',
    description: 'Witty, playful, and entertaining approach'
  },
  {
    value: 'formal',
    label: 'Formal',
    icon: '📜',
    description: 'Official, structured, and precise language'
  },
  {
    value: 'creative',
    label: 'Creative',
    icon: '🎨',
    description: 'Innovative, imaginative, and original content'
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
    icon: '✨',
    description: 'Motivational, uplifting, and empowering messages'
  },
  {
    value: 'technical',
    label: 'Technical',
    icon: '💻',
    description: 'Detailed, precise, and specialized content'
  },
  {
    value: 'storytelling',
    label: 'Storytelling',
    icon: '📚',
    description: 'Narrative-driven, engaging, and immersive style'
  }
];

// Initialize OpenAI with secure environment variable handling
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Use with caution in production
});

export default function CaptionGenerator() {
  // Enhanced state management with more comprehensive types
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPlatform, setPlatform] = useState<string>('instagram');
  const [tone, setTone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hashtagCount, setHashtagCount] = useState<number>(10);
  const [captionLength, setCaptionLength] = useState<string>('medium');
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Enhanced content generation tracking
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);

  const { toast } = useToast();

  // Memoized platform and tone details for performance
  const currentPlatform = useMemo(() => platforms[selectedPlatform], [selectedPlatform]);

  // Enhanced file upload handler with error checking
  const handleFileUpload = useCallback((file: File) => {
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image (JPEG, PNG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  // Content generation with enhanced error handling
  const generateContent = async () => {
    if (!image || !tone) {
      toast({
        title: "Incomplete Input",
        description: "Please upload an image and select a tone",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setProgress(20);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "system",
                content: `Advanced social media content creator:
                - Platform: ${selectedPlatform}
                - Tone: ${tone}
                - Caption Length: ${captionLength}
                - Hashtag Count: ${hashtagCount}
                
                Generate:
                1. Concise image description
                2. ${hashtagCount} strategic hashtags
                3. Engaging social media caption
                4. Tailored to platform specifications
                
                Additional Context: ${description || 'No specific context provided'}`
              },
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: { url: base64Image }
                  },
                  {
                    type: "text",
                    text: "Generate optimized social media content"
                  }
                ]
              }
            ],
            max_tokens: 400
          });

          const outputText = response.choices[0].message.content || '';

          // Enhanced parsing with fallback mechanisms
          const sections = outputText.split('\n\n');
          const imageDescription = sections[0] || 'No description available';
          const hashtags = sections[1] ?
            sections[1].split(',')
              .map(tag => tag.trim().replace(/^#/, ''))
              .filter(tag => tag.length > 0)
              .slice(0, hashtagCount) :
            [];
          const captions = sections.slice(2).filter(caption => caption.trim().length > 0);

          const newContent: GeneratedContent = {
            caption: captions[0] || 'No caption generated',
            hashtags: hashtags,
            imageDescription: imageDescription,
            timestamp: Date.now()
          };

          setGeneratedContents(prev => [newContent, ...prev]);
          setProgress(100);

          toast({
            title: "Content Generated",
            description: "Your social media content is ready!",
          });
        } catch (error) {
          console.error('OpenAI Content generation error:', error);
          toast({
            title: "Generation Failed",
            description: "Unable to generate content. Please try again.",
            variant: "destructive"
          });
          setProgress(0);
        }
      };
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the image",
        variant: "destructive"
      });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }

  // Enhanced copy and share functionality
  const handleCopyContent = useCallback((content: GeneratedContent) => {
    const textToCopy = `${content.caption}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy content",
        variant: "destructive"
      });
    });
  }, [toast]);

  // Clear image and reset state
  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    setGeneratedContents([]);
  }

  // Main render
  return (
    <Layout>
      {/* Sparkle Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="caption-generator-sparkles"
          background="purple"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={300}
          particleColor="#FFFFFF"
        />
      </div>

      <div className="min-h-screen py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              VibeVerse (AI Caption Generator)
              <Badge className='ml-3'>1.0 V</Badge>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload an image and let AI generate the perfect caption for your social media posts
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8 border-dashed border-2 border-violet-500 rounded-lg">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Image Preview and Actions */}
          {imagePreview && (
            <div className="mb-8 flex flex-col items-center relative">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Upload Preview"
                  className="max-w-xs max-h-64 rounded-lg shadow-md mb-4"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleClearImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2 mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={generateContent}
                        variant="outline"
                        className="gap-2"
                        disabled={loading || !tone}
                      >
                        <ImageIcon className="h-4 w-4" />
                        Generate Content
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate social media content for your image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {loading && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Content Generation Controls */}
          <Card className="mb-8">
            <CardContent className="space-y-6 pt-6">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={selectedPlatform}
                  onValueChange={(value) => setPlatform(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(platforms).map(([key, platform]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <span className="capitalize mr-2">{key}</span>
                          <Badge variant="outline" className="text-xs">
                            Limit: {platform.hashtagLimit} hashtags
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tone Selection with Descriptions */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.icon}</span>
                          <div>
                            <div>{option.label}</div>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Context */}
              <div className="space-y-2">
                <Label>Additional Context (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide extra details to guide content generation..."
                  className="resize-y"
                  rows={3}
                />
              </div>

              {/* Hashtag Count Slider */}
              <div className="space-y-2">
                <Label>Number of Hashtags</Label>
                <Slider
                  value={[hashtagCount]}
                  onValueChange={(value) => setHashtagCount(value[0])}
                  min={5}
                  max={currentPlatform.hashtagLimit}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5</span>
                  <span>{currentPlatform.hashtagLimit}</span>
                </div>
              </div>

              {/* Advanced Settings Dialog */}
              <div className="flex justify-between items-center">
                <Dialog open={openSettings} onOpenChange={setOpenSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      Advanced Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Content Generation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Caption Length</Label>
                        <RadioGroup
                          value={captionLength}
                          onValueChange={setCaptionLength}
                          className="grid grid-cols-3 gap-4"
                        >
                          {['short', 'medium', 'long'].map((length) => (
                            <div key={length}>
                              <RadioGroupItem
                                value={length}
                                id={length}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={length}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                {length.charAt(0).toUpperCase() + length.slice(1)}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={generateContent}
                  disabled={!image || !tone || loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Content Section */}
          {generatedContents.length > 0 && (
            <div className="space-y-6">
              <Tabs defaultValue="latest">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="latest">Latest Content</TabsTrigger>
                  <TabsTrigger value="history">Generation History</TabsTrigger>
                </TabsList>

                <TabsContent value="latest">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Generated Caption</h3>
                          <p className="text-muted-foreground">
                            {generatedContents[0].caption}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
                          <div className="flex flex-wrap gap-2">
                            {generatedContents[0].hashtags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleCopyContent(generatedContents[0])}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Content
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  {generatedContents.slice(1).map((content, _index) => (
                    <Card key={content.timestamp} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Generated on: {new Date(content.timestamp).toLocaleString()}
                            </p>
                            <p>{content.caption}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="secondary"
                                className="cursor-pointer"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyContent(content)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Platform Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                Platform Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 capitalize">
                    {selectedPlatform} Strategy
                  </h4>
                  <p className="text-muted-foreground">
                    {currentPlatform.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Content Tips</h4>
                  <p className="text-muted-foreground">
                    {selectedPlatform === 'instagram' &&
                      'Mix popular and niche hashtags. Consider adding hashtags in the first comment.'}
                    {selectedPlatform === 'twitter' &&
                      'Use 1-2 relevant hashtags. Place them naturally within the tweet.'}
                    {selectedPlatform === 'facebook' &&
                      'Minimize hashtag usage. Focus on 1-2 highly relevant tags.'}
                    {selectedPlatform === 'linkedin' &&
                      'Use 3-5 professional and industry-specific hashtags.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}