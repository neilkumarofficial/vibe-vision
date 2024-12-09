'use client';

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

// Enhanced React Icons
import {
    IoCloudUploadOutline,
    IoTrashBinOutline,
    IoShareSocialOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoDocumentTextOutline,
    IoRocketOutline,
    IoColorPaletteOutline,
    IoDownloadOutline,
    IoLinkOutline
} from 'react-icons/io5';
import {
    FaSpinner,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaTiktok
} from 'react-icons/fa6';

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
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
import { Switch } from "@/components/ui/switch";

import { Layout } from '@/components/layout/layout';
import MessageToast from '@/components/ui/MessageToast';
import MyGenerations from '@/components/ui/bikini-bottom-news/my-generations';

// Enhanced Bubble Animation Component
const BubbleBackground = () => {
    const bubbleCount = 25;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(bubbleCount)].map((_, index) => {
                const size = Math.random() * 40 + 10;
                const delay = Math.random() * 15;
                const duration = Math.random() * 15 + 15;
                const left = Math.random() * 100;
                const opacity = Math.random() * 0.5 + 0.2;

                return (
                    <div
                        key={index}
                        className="absolute bg-white/30 rounded-full animate-bubble-up"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            bottom: '-50px',
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                            opacity: opacity
                        }}
                    />
                );
            })}
        </div>
    );
};


interface ContentItem {
    _id: string;
    contentType: string;
    // Add other relevant properties
}

const DEFAULT_NEWS_DURATION = 30;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const SUPPORTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4'
];

export default function BikiniBottomNewsPage() {
    // Enhanced State Management
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isVideoGenerated, setIsVideoGenerated] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedMediaPreview, setSelectedMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'pdf' | 'video' | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'default' });
    const [settings, setSettings] = useState({
        duration: DEFAULT_NEWS_DURATION,
        subtitleColor: '#ffffff',
        subtitleSize: 24,
        newsStyle: 'funny',
        voiceType: 'johnnyelaine',
        backgroundMusic: false
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
            showAlert('Unsupported file type. Please upload an image, PDF, or MP4.', 'destructive');
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
        const type = file.type.startsWith('image/') ? 'image' :
            file.type === 'application/pdf' ? 'pdf' :
                file.type.startsWith('video/') ? 'video' : null;
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

    // Image resizing logic (similar to previous implementation)
    const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
        return new Promise((resolve, reject) => {
            // Create a file reader to read the uploaded image
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Create an off-screen canvas for resizing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Could not create canvas context'));
                        return;
                    }

                    // Calculate new dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    // Calculate scaling factor
                    const scale = Math.min(
                        maxWidth / width,
                        maxHeight / height,
                        1  // Prevent upscaling
                    );

                    width = Math.round(width * scale);
                    height = Math.round(height * scale);

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the resized image
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to blob
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Could not convert canvas to blob'));
                            return;
                        }

                        // Create a new File object from the blob
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
        formData.append('style', settings.newsStyle);
        formData.append('duration', String(settings.duration));
        formData.append('voiceType', settings.voiceType);
        formData.append('backgroundMusic', String(settings.backgroundMusic));

        try {
            // Simulate video generation 
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock video URL for demonstration
            setGeneratedVideoUrl('/mock-video-url.mp4');

            fetchData();
            showToast();
            setIsVideoGenerated(true);
        } catch (error) {
            console.error('Error generating video:', error);
            setError('An error occurred while generating the video');
        } finally {
            setIsLoading(false);
        }
    };

    // Other utility functions remain similar to previous implementation
    const showAlert = (_variant = 'default', _p0?: string) => { /* ... */ };
    const fetchData = async () => { /* ... */ };

    // New Sharing Functionality
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
            {/* Background and Bubble Effects */}
            <div className="fixed inset-0 bg-gradient-to-br animate-gradient-ocean z-0 opacity-70">
                <div className="absolute inset-0 bg-gradient-to-br animate-gradient-ocean-overlay opacity-20"></div>
            </div>
            <BubbleBackground />

            <div className="min-h-screen bg-transparent p-6 md:p-16 pb-40 relative">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/image.png')] bg-cover bg-bottom opacity-50 z-0"></div>
                {/* Page Header */}
                <div className="max-w-7xl mx-auto space-y-8 relative">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                            🌊 Bikini Bottom News Generator 🍍
                        </h1>
                        <p className="text-xl text-yellow-100 drop-shadow-md">
                            Transform your media into hilarious underwater news reports!
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <Card className="bg-white/20 backdrop-blur-lg border-yellow-500 border-2 shadow-2xl">
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
                                                    className="w-full h-64 border-2 border-yellow-500 object-contain rounded-lg"
                                                />
                                            )}
                                            {mediaType === 'pdf' && (
                                                <div className="w-full h-64 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
                                                    <IoDocumentTextOutline className="text-4xl text-red-500 mr-2" />
                                                    <p className="text-white">{mediaFile?.name}</p>
                                                </div>
                                            )}
                                            {mediaType === 'video' && (
                                                <video
                                                    src={selectedMediaPreview}
                                                    className="w-full h-64 border-2 border-yellow-500 object-contain rounded-lg"
                                                    controls
                                                />
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="icon"
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
                                                <IoTrashBinOutline className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                "h-full border-2 min-h-64 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer",
                                                "transition-colors hover:border-yellow-500",
                                                "border-yellow-500 bg-yellow-500/10"
                                            )}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,application/pdf,video/mp4"
                                                onChange={handleMediaUpload}
                                                className="h-full w-full opacity-0 cursor-pointer absolute"
                                            />
                                            <IoCloudUploadOutline className="h-12 w-12 text-yellow-500 mb-4" />
                                            <p className="text-yellow-100 text-center">
                                                Upload Image, PDF, or Video for News Report
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Settings and Generation Section */}
                                <div className="space-y-4">
                                    <div className="space-y-6 py-4">
                                        {/* Duration Slider */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-white flex items-center">
                                                    <IoRocketOutline className="mr-2" /> Video Duration
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <IoHelpCircleOutline className="text-yellow-300" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Adjust the duration of your news video</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Slider
                                                value={[settings.duration]}
                                                onValueChange={([value]) =>
                                                    setSettings(prev => ({ ...prev, duration: value }))
                                                }
                                                max={60}
                                                min={10}
                                                step={5}
                                            />
                                            <p className="text-white text-sm">{settings.duration} seconds</p>
                                        </div>

                                        {/* News Style Selector */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-white flex items-center">
                                                    <IoColorPaletteOutline className="mr-2" /> News Style
                                                </Label>
                                                <IoSettingsOutline
                                                    className="text-yellow-300 cursor-pointer hover:rotate-45 transition-transform"
                                                    onClick={() => setAdvancedSettingsOpen(true)}
                                                />
                                            </div>
                                            <Select
                                                value={settings.newsStyle}
                                                onValueChange={(value) =>
                                                    setSettings(prev => ({ ...prev, newsStyle: value }))
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select News Style" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="funny" className="flex items-center">
                                                        🤪 Funny Style
                                                    </SelectItem>
                                                    <SelectItem value="roast" className="flex items-center">
                                                        🔥 Roast Mode
                                                    </SelectItem>
                                                    <SelectItem value="sarcastic" className="flex items-center">
                                                        🙄 Sarcastic Spin
                                                    </SelectItem>
                                                    <SelectItem value="investigative" className="flex items-center">
                                                        🕵️ Investigative Report
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Generation and Action Buttons */}
                                    <div className="space-y-4">
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={isLoading || !mediaFile}
                                            className="w-full group"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FaSpinner className="mr-2 animate-spin" />
                                                    Generating Underwater Magic...
                                                </>
                                            ) : (
                                                <>
                                                    <IoRocketOutline className="mr-2 group-hover:animate-bounce" />
                                                    Generate Roast Video
                                                </>
                                            )}
                                        </Button>

                                        {isVideoGenerated && (
                                            <div className="space-y-2">
                                                <Button
                                                    onClick={() => setShareDialogOpen(true)}
                                                    variant="secondary"
                                                    className="w-full flex items-center"
                                                >
                                                    <IoShareSocialOutline className="mr-2" /> Share Video
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        // Implement download logic
                                                        const link = document.createElement('a');
                                                        link.href = generatedVideoUrl || '';
                                                        link.download = 'bikini-bottom-news.mp4';
                                                        link.click();
                                                    }}
                                                    variant="outline"
                                                    className="w-full flex items-center"
                                                >
                                                    <IoDownloadOutline className="mr-2" /> Download Video
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generations Section */}
                    <div className="mt-8">
                        <MyGenerations data={data.filter(item => item.contentType === "bikini-bottom-news").reverse()} />
                    </div>

                    {/* Advanced Settings Dialog */}
                    <Dialog open={advancedSettingsOpen} onOpenChange={setAdvancedSettingsOpen}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center">
                                    <IoSettingsOutline className="mr-2" /> Advanced News Video Settings
                                </DialogTitle>
                                <DialogDescription>
                                    Customize your underwater news experience
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Label className="flex-grow">Voice Type</Label>
                                    <Select
                                        value={settings.voiceType}
                                        onValueChange={(value) =>
                                            setSettings(prev => ({ ...prev, voiceType: value }))
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Voice" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="johnnyelaine">Johnny Elaine</SelectItem>
                                            <SelectItem value="spongebob">SpongeBob</SelectItem>
                                            <SelectItem value="patrick">Patrick</SelectItem>
                                            <SelectItem value="squidward">Squidward</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Label className="flex-grow">Background Music</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={settings.backgroundMusic}
                                            onCheckedChange={(checked) =>
                                                setSettings(prev => ({ ...prev, backgroundMusic: checked }))
                                            }
                                        />
                                        <span className="text-sm">
                                            {settings.backgroundMusic ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Label className="flex-grow">Subtitle Color</Label>
                                    <Input
                                        type="color"
                                        value={settings.subtitleColor}
                                        onChange={(e) =>
                                            setSettings(prev => ({ ...prev, subtitleColor: e.target.value }))
                                        }
                                        className="h-10 w-20 p-0"
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Label className="flex-grow">Subtitle Size</Label>
                                    <Slider
                                        value={[settings.subtitleSize]}
                                        onValueChange={([value]) =>
                                            setSettings(prev => ({ ...prev, subtitleSize: value }))
                                        }
                                        max={36}
                                        min={12}
                                        step={2}
                                        className="w-[180px]"
                                    />
                                    <span className="text-sm">{settings.subtitleSize}px</span>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    onClick={() => setAdvancedSettingsOpen(false)}
                                >
                                    Close Settings
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Share Dialog */}
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-center">
                                    <span className="mr-2">🌊</span> Share Your Roast Video <span className="ml-2">🍍</span>
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
                        message="🎉 Underwater Roast Video Generated Successfully! 🌊"
                        onClose={() => setToastVisible(false)}
                    />
                </div>
            </div>
        </Layout>
    );
}

function showToast() {
    throw new Error('Function not implemented.');
}
