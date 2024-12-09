'use client';

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

// Enhanced React Icons
import {
    IoCloudUploadOutline,
    IoTrashBinOutline,
    IoShareSocialOutline,
    IoDocumentTextOutline,
    IoRocketOutline,
    IoDownloadOutline,
    IoLinkOutline,
    IoGameControllerOutline,
    IoSchoolOutline
} from 'react-icons/io5';
import {
    FaSpinner,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaGamepad
} from 'react-icons/fa6';

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { Layout } from '@/components/layout/layout';
import MessageToast from '@/components/ui/MessageToast';
import MyGenerations from '@/components/ui/bikini-bottom-news/my-generations';
import { SparklesCore } from '@/components/ui/sparkles';

// Define interfaces for more robust typing
interface ContentItem {
    _id: string;
    contentType: string;
}

interface GameBackgroundTemplate {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
}

// Game Background Templates
const GAME_BACKGROUND_TEMPLATES: GameBackgroundTemplate[] = [
    {
        id: 'minecraft',
        name: 'Minecraft Classroom',
        icon: FaGamepad,
        description: 'Learn in a blocky, pixelated classroom environment'
    },
    {
        id: 'fortnite',
        name: 'Fortnite School Zone',
        icon: IoGameControllerOutline,
        description: 'Educational content with battle royale vibes'
    },
    {
        id: 'roblox',
        name: 'Roblox Learning Hub',
        icon: IoSchoolOutline,
        description: 'Customizable learning spaces'
    },
    {
        id: 'among-us',
        name: 'Among Us Lecture Hall',
        icon: IoGameControllerOutline,
        description: 'Suspiciously educational content'
    },
    {
        id: 'pokemon',
        name: 'Pokémon Study Arena',
        icon: IoSchoolOutline,
        description: 'Catch knowledge like Pokémon!'
    }
];

const DEFAULT_NEWS_DURATION = 1;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const SUPPORTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain', // .txt
    'application/msword', // .doc
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
];

export default function BrainRotGeneratorPage() {
    // Enhanced State Management
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isVideoGenerated, setIsVideoGenerated] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedMediaPreview, setSelectedMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'pdf' | 'video' | 'document' | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'default' });
    const [settings, setSettings] = useState({
        duration: DEFAULT_NEWS_DURATION,
        subtitleColor: '#ffffff',
        subtitleSize: 24,
        videoStyle: 'funny',
        backgroundTemplate: 'minecraft',
        voiceType: 'studentAI',
        backgroundMusic: true,
        educationalMode: false,
        studentName: '',
        subject: ''
    });

    const [toastVisible, setToastVisible] = useState(false);
    const [data, setData] = useState<ContentItem[]>([]);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
    const [copyLinkTooltip, setCopyLinkTooltip] = useState('Copy Link');

    // Ref for file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Enhanced file validation
    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            showAlert(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`, 'destructive');
            return false;
        }

        if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
            showAlert('Unsupported file type. Please upload a compatible document.', 'destructive');
            return false;
        }

        return true;
    };

    // Enhanced media handling
    const handleMediaUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;

        if (!validateFile(file)) return;

        // Determine media type
        const type =
            file.type.startsWith('image/') ? 'image' :
                file.type === 'application/pdf' ? 'pdf' :
                    file.type.startsWith('video/') ? 'video' :
                        file.type.includes('document') || file.type === 'text/plain' ? 'document' :
                            null;
        setMediaType(type);

        try {
            let processedFile = file;
            let previewUrl = URL.createObjectURL(file);

            if (type === 'image') {
                processedFile = await resizeImage(file, 800, 800);
                previewUrl = URL.createObjectURL(processedFile);
            }

            setMediaFile(processedFile);
            setSelectedMediaPreview(previewUrl);
            setError(null);
            showAlert(`Added ${file.name}!`, 'default');
        } catch (error) {
            console.error("Error processing media:", error);
            setError("Failed to process media. Please try again.");
        }
    };

    // Image resizing logic 
    const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Could not create canvas context'));
                        return;
                    }

                    let width = img.width;
                    let height = img.height;

                    const scale = Math.min(
                        maxWidth / width,
                        maxHeight / height,
                        1
                    );

                    width = Math.round(width * scale);
                    height = Math.round(height * scale);

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Could not convert canvas to blob'));
                            return;
                        }

                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });

                        resolve(resizedFile);
                    }, file.type);
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target?.result as string;
            };

            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsDataURL(file);
        });
    }

    // Generate Video Handler
    const handleGenerate = async () => {
        if (!mediaFile) {
            showAlert('Please upload a media file before submitting.', 'destructive');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        formData.append('media', mediaFile);
        formData.append('time', String(Date.now()));
        formData.append('style', settings.videoStyle);
        formData.append('duration', String(settings.duration));
        formData.append('voiceType', settings.voiceType);
        formData.append('backgroundMusic', String(settings.backgroundMusic));
        formData.append('backgroundTemplate', settings.backgroundTemplate);

        // Additional educational metadata
        if (settings.educationalMode) {
            formData.append('studentName', settings.studentName);
            formData.append('subject', settings.subject);
        }

        try {
            // Simulate video generation 
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock video URL for demonstration
            setGeneratedVideoUrl('/mock-brain-rot-video.mp4');

            fetchData();
            showToast();
            setIsVideoGenerated(true);
        } catch (error) {
            console.error('Error generating video:', error);
            setError('An error occurred while generating the Brain Rot video');
        } finally {
            setIsLoading(false);
        }
    };

    // Utility functions (placeholders)
    const showAlert = (message: string, variant: string = 'default') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'default' }), 3000);
    };

    const showToast = () => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchData = async () => {
        // Placeholder for data fetching
        // In a real app, this would fetch user's previous generations
    };

    // Copy Link Handler
    const handleCopyLink = () => {
        if (generatedVideoUrl) {
            navigator.clipboard.writeText(generatedVideoUrl);
            setCopyLinkTooltip('Copied!');
            setTimeout(() => setCopyLinkTooltip('Copy Link'), 2000);
        }
    };

    // Side Effects
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen  p-6 md:p-16 pb-40 relative">
                {/* Sparkle Background Effect */}
                <div className="absolute inset-0 z-0">
                    <SparklesCore
                        id="brain-rot-sparkles"
                        background="purple"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={500}
                        particleColor="#FFFFFF"
                    />
                </div>

                <div className="max-w-7xl mx-auto space-y-8 relative">
                    {/* Page Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-fuchsia-700 drop-shadow-lg">
                            🧠 Brain Rot Knowledge Transformer 🚀
                        </h1>
                        <p className="text-xl text-white drop-shadow-md">
                            Turn any boring document into an epic, meme-worthy learning experience! 💥📚
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <Card className="bg-stone-600/30 backdrop-blur-lg border-fuchsia-700 border-2 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Media Upload Section */}
                                <div className="relative">
                                    {isLoading && (
                                        <Progress value={progress} className="absolute top-0 z-10" />
                                    )}

                                    {selectedMediaPreview ? (
                                        <div className="relative">
                                            {mediaType === 'image' && (
                                                <img
                                                    src={selectedMediaPreview}
                                                    alt="Uploaded content"
                                                    className="w-full h-64 border-2 border-fuchsia-700 object-contain rounded-lg"
                                                />
                                            )}
                                            {mediaType === 'pdf' && (
                                                <div className="w-full h-64 border-2 border-fuchsia-700 rounded-lg flex items-center justify-center">
                                                    <IoDocumentTextOutline className="text-4xl text-red-500 mr-2" />
                                                    <p className="text-white">{mediaFile?.name}</p>
                                                </div>
                                            )}
                                            {mediaType === 'video' && (
                                                <video
                                                    src={selectedMediaPreview}
                                                    className="w-full h-64 border-2 border-fuchsia-700 object-contain rounded-lg"
                                                    controls
                                                />
                                            )}
                                            {mediaType === 'document' && (
                                                <div className="w-full h-64 border-2 border-fuchsia-700 rounded-lg flex items-center justify-center">
                                                    <IoDocumentTextOutline className="text-4xl text-blue-500 mr-2" />
                                                    <p className="text-white truncate max-w-[200px]">{mediaFile?.name}</p>
                                                </div>
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setMediaFile(null);
                                                    setSelectedMediaPreview(null);
                                                    setMediaType(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                <IoTrashBinOutline className="mr-2" /> Clear
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="w-full h-64 border-2 border-dashed border-fuchsia-700 rounded-lg flex flex-col items-center justify-center text-center hover:bg-stone-600/30 transition-all duration-300"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <IoCloudUploadOutline className="text-5xl text-fuchsia-700 mb-4" />
                                            <p className="text-white mb-2">
                                                Drag and drop or click to upload
                                            </p>
                                            <p className="text-sm text-stone-300">
                                                Supports: PDF, Images, Videos, Docs (Max 25MB)
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleMediaUpload}
                                        accept={SUPPORTED_FILE_TYPES.join(',')}
                                    />
                                </div>

                                {/* Settings and Generation Section */}
                                <div className="space-y-4">
                                    {/* Video Style Selection */}
                                    <div>
                                        <Label className="text-white mb-2">Video Style</Label>
                                        <Select
                                            value={settings.videoStyle}
                                            onValueChange={(value) => setSettings(prev => ({
                                                ...prev,
                                                videoStyle: value as 'funny' | 'serious' | 'educational'
                                            }))}
                                        >
                                            <SelectTrigger className="w-full bg-stone-600/30 text-white border-fuchsia-700">
                                                <SelectValue placeholder="Select Video Style" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="funny">🤪 Meme-style Funny</SelectItem>
                                                <SelectItem value="serious">🧐 Professional</SelectItem>
                                                <SelectItem value="educational">📚 Classic Educational</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Duration Slider */}
                                    <div>
                                        <Label className="text-white mb-2">
                                            Video Duration: {settings.duration} min
                                        </Label>
                                        <Slider
                                            defaultValue={[DEFAULT_NEWS_DURATION]}
                                            max={5}
                                            min={0.5}
                                            step={0.5}
                                            onValueChange={(value) => setSettings(prev => ({
                                                ...prev,
                                                duration: value[0]
                                            }))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Advanced Settings Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="advanced-settings"
                                            checked={advancedSettingsOpen}
                                            onCheckedChange={() => setAdvancedSettingsOpen(!advancedSettingsOpen)}
                                        />
                                        <Label
                                            htmlFor="advanced-settings"
                                            className="text-white cursor-pointer"
                                        >
                                            Open Advanced Settings
                                        </Label>
                                    </div>

                                    {/* Advanced Settings */}
                                    {advancedSettingsOpen && (
                                        <div className="space-y-4 p-4 bg-stone-600/30 rounded-lg">
                                            {/* Game Background Template */}
                                            <div>
                                                <Label className="text-white mb-2">Game Background</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {GAME_BACKGROUND_TEMPLATES.map((template) => (
                                                        <TooltipProvider key={template.id}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant={settings.backgroundTemplate === template.id ? 'default' : 'outline'}
                                                                        size="sm"
                                                                        className={cn(
                                                                            "flex flex-col h-20 w-full",
                                                                            settings.backgroundTemplate === template.id
                                                                                ? "bg-fuchsia-700 text-black"
                                                                                : "bg-stone-600/30 text-white"
                                                                        )}
                                                                        onClick={() => setSettings(prev => ({
                                                                            ...prev,
                                                                            backgroundTemplate: template.id
                                                                        }))}
                                                                    >
                                                                        <template.icon className="text-2xl mb-1" />
                                                                        <span className="text-xs">{template.name}</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {template.description}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Educational Mode */}
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="educational-mode"
                                                    checked={settings.educationalMode}
                                                    onCheckedChange={() => setSettings(prev => ({
                                                        ...prev,
                                                        educationalMode: !prev.educationalMode
                                                    }))}
                                                />
                                                <Label
                                                    htmlFor="educational-mode"
                                                    className="text-white cursor-pointer"
                                                >
                                                    Enable Educational Metadata
                                                </Label>
                                            </div>

                                            {settings.educationalMode && (
                                                <div className="space-y-2">
                                                    <Input
                                                        placeholder="Student Name"
                                                        value={settings.studentName}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            studentName: e.target.value
                                                        }))}
                                                        className="bg-stone-600/30 text-white border-fuchsia-700"
                                                    />
                                                    <Input
                                                        placeholder="Subject"
                                                        value={settings.subject}
                                                        onChange={(e) => setSettings(prev => ({
                                                            ...prev,
                                                            subject: e.target.value
                                                        }))}
                                                        className="bg-stone-600/30 text-white border-fuchsia-700"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <Button
                                        size="lg"
                                        className="w-full bg-fuchsia-700 hover:bg-fuchsia-700 text-black"
                                        onClick={handleGenerate}
                                        disabled={!mediaFile || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FaSpinner className="mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <IoRocketOutline className="mr-2" />
                                                Generate Brain Rot Video
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generated Video Section */}
                    {isVideoGenerated && generatedVideoUrl && (
                        <div className="bg-stone-600/30 backdrop-blur-lg border-fuchsia-700 border-2 rounded-lg p-6 mt-8">
                            <div className="grid md:grid-cols-2 gap-6 items-center">
                                <video
                                    src={generatedVideoUrl}
                                    controls
                                    className="w-full rounded-lg shadow-2xl"
                                />
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-fuchsia-700">
                                        Your Brain Rot Video is Ready! 🎉
                                    </h2>
                                    <div className="flex space-x-4">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleCopyLink}
                                                        className="bg-stone-600/30 text-white"
                                                    >
                                                        <IoLinkOutline className="mr-2" />
                                                        {copyLinkTooltip}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Copy shareable link
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <Button
                                            variant="secondary"
                                            onClick={() => window.open(generatedVideoUrl, '_blank')}
                                            className="bg-stone-600/30 text-white"
                                        >
                                            <IoDownloadOutline className="mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            className="bg-stone-600/30 text-white"
                                            onClick={() => setShareDialogOpen(true)}
                                        >
                                            <IoShareSocialOutline className="mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Generations Section */}
                <div className="mt-8">
                    <MyGenerations data={data.filter(item => item.contentType === "brain-rot").reverse()} />
                </div>
                {/* Share Dialog */}
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-center">
                                <span className="mr-2">🧠</span> Share Your BrainRot Video to you friends <span className="ml-2">💫</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 p-4">
                            {[
                                { icon: FaFacebook, label: 'Facebook', color: 'text-blue-600' },
                                { icon: FaTwitter, label: 'Twitter', color: 'text-sky-500' },
                                { icon: FaLinkedin, label: 'LinkedIn', color: 'text-blue-700' },
                                { icon: FaYoutube, label: 'YouTube', color: 'text-red-600' },
                                { icon: FaTiktok, label: 'TikTok', color: 'text-black' }
                            ].map((platform) => (
                                <Button
                                    key={platform.label}
                                    variant="outline"
                                    className="flex items-center justify-center"
                                    onClick={() => {
                                        // Implement platform-specific sharing
                                        alert(`Sharing to ${platform.label}`);
                                    }}
                                >
                                    <platform.icon className={`mr-2 ${platform.color}`} />
                                    {platform.label}
                                </Button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 p-4">
                            <Input
                                value={generatedVideoUrl || ''}
                                readOnly
                                className="flex-grow"
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopyLink}
                                        >
                                            <IoLinkOutline className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {copyLinkTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShareDialogOpen(false)}
                                className="w-full"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Alerts */}
                {alert.show && (
                    <Alert
                        variant={alert.variant as any}
                        className="fixed bottom-4 right-4 z-50 animate-bounce"
                    >
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}

                {/* Toast Notification */}
                <MessageToast
                    visible={toastVisible}
                    message="🎉 BrainRot Video Generated Successfully! 💫"
                    onClose={() => setToastVisible(false)}
                />
            </div>
        </Layout>
    );
}