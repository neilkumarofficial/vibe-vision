'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Slider } from "../../../components/ui/slider";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Progress } from "../../../components/ui/progress";
import { Label } from "../../../components/ui/label";

// Lucide Icons
import {
    Trash2,
    Download,
    Share,
    Upload,
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    RefreshCw,
    Settings,
    HelpCircle
} from 'lucide-react';
import { BASE_URL } from '@/config';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Layout } from '@/components/layout/layout';
import MessageToast from '@/components/ui/MessageToast';


const VOICE_OPTIONS = [
    { value: 'aura-asteria-en', label: 'Asteria', description: 'American, Feminine voice', gender: 'f' },
    { value: 'aura-orpheus-en', label: 'Orpheus', description: 'American, Masculine voice', gender: 'm' },
    { value: 'aura-angus-en', label: 'Angus', description: 'Irish, Masculine voice', gender: 'm' },
    { value: 'aura-arcas-en', label: 'Arcas', description: 'American, Masculine voice', gender: 'm' },
    { value: 'aura-athena-en', label: 'Athena', description: 'British, Feminine voice', gender: 'f' },
    { value: 'aura-helios-en', label: 'Helios', description: 'British, Masculine voice', gender: 'm' },
    { value: 'aura-hera-en', label: 'Hera', description: 'American, Feminine voice', gender: 'f' },
    { value: 'aura-luna-en', label: 'Luna', description: 'American, Feminine voice', gender: 'f' },
    { value: 'aura-orion-en', label: 'Orion', description: 'American, Masculine voice', gender: 'm' },
    { value: 'aura-perseus-en', label: 'Perseus', description: 'American, Masculine voice', gender: 'm' },
    { value: 'aura-stella-en', label: 'Stella', description: 'American, Feminine voice', gender: 'm' },
    { value: 'aura-zeus-en', label: 'Zeus', description: 'American, Masculine voice', gender: 'm' },
];
// const VOICE_OPTIONS = [
//     { value: 'alloy', label: 'Asteria', description: 'Versatile and balanced voice' },
//     { value: 'echo', label: 'Echo', description: 'Warm and precise voice' },
//     { value: 'fable', label: 'Fable', description: 'Expressive and dynamic voice' },
//     { value: 'onyx', label: 'Onyx', description: 'Deep and resonant voice' },
//     { value: 'nova', label: 'Nova', description: 'Youthful and bright voice' }
// ];

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_ROAST_DURATION = 30; // seconds

export default function RoastVideoCreator() {
    // State Management
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    // const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [roastScript, setRoastScript] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [isVideoGenerated, setIsVideoGenerated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'default' });
    const [settings, setSettings] = useState({
        duration: DEFAULT_ROAST_DURATION,
        subtitleColor: '#ffffff',
        subtitleSize: 24,
        roastStyle: 'funny'
    });

    const [localStorageInstance, setLocalStorageInstance] = useState<Storage | null>(null)

    const [toastVisible, setToastVisible] = useState(false);

    const showToast = () => {
        setToastVisible(true);
        // The toast will auto-close after 2 seconds because of the useEffect in the Toast component
    };

    useEffect(() => {
        setLocalStorageInstance(localStorage);
    }, [])


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageName(file.name)
            setSelectedImage(imageUrl);
        }
        setImageFile(file);
        setError(null); // Reset error on new file upload
        showAlert(`Added ${imageName}!`, 'default')
    };


    const handleGenerate = async () => {
        let currentTime = Date.now();
        const token = localStorageInstance?.getItem('token');
        const loggedInUser = localStorageInstance?.getItem('loggedInUser');

        if (!imageFile) {
            //   alert('Please upload an image before submitting.');
            showAlert('Please upload an image before submitting.')
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('time', String(currentTime));
        formData.append('voice', selectedVoice);
        formData.append('style', settings.roastStyle);
        formData.append('duration', String(settings.duration));
        formData.append('userName', String(loggedInUser));
        // formData.append('user_id', String(currentUserToken));

        try {
            showToast()

            const response = await axios.post(
                `${BASE_URL}/api/generate-video/roast-video`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setRoastScript(response.data.summary || 'No summary generated.');
            setVideoUrl(`${BASE_URL}/${response.data.video}`);
            setIsVideoGenerated(true);
            console.log(`${BASE_URL}/${response.data.video}`);
        } catch (error) {
            console.error('Error generating summary:', error);
            setError('An error occurred while generating the summary, audio, or video');
        } finally {
            setIsLoading(false);
        }
    };

    // File Upload Handler
    // const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
    //     if (rejectedFiles.length > 0) {
    //         const error = rejectedFiles[0].errors[0];
    //         if (error.code === 'file-too-large') {
    //             showAlert(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 'destructive');
    //         } else if (error.code === 'file-invalid-type') {
    //             showAlert('Invalid file type. Please upload an image file', 'destructive');
    //         }
    //         return;
    //     }

    //     const file = acceptedFiles[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             // setImageFile({
    //             //     url: e.target.result,
    //             //     file: file,
    //             //     name: file.name
    //             // });
    //             // const file = e.target && e.target.files ? e.target.files[0] : null;
    //             if (file) {
    //                 const imageUrl = URL.createObjectURL(file);
    //                 setImageName(file.name)
    //                 setSelectedImage(imageUrl);
    //             }
    //             setImageFile(file);
    //             setError(null);
    //             showAlert('Image uploaded successfully', 'success');
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // }, []);

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //     onDrop,
    //     accept: {
    //         'image/*': SUPPORTED_FORMATS
    //     },
    //     maxSize: MAX_FILE_SIZE,
    //     multiple: false
    // });

    // Alert Handler
    const showAlert = (message: string, variant = 'default') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'default' }), 3000);
    };

    // UI Event Handlers
    const handleDeleteImage = () => {
        setImageFile(null);
        setSelectedImage(null)
        setRoastScript('');
        setAudioBlob(null);
        setVideoUrl('');
        showAlert('Content cleared', 'default');
        setIsVideoGenerated(false)
    };

    // const handleDownloadVideo = () => {
    //     if (videoUrl) {
    //         const a = document.createElement('a');
    //         a.href = videoUrl;
    //         a.download = 'roast-video.mp4';
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //     }
    // };

    const handleDownloadVideo = async () => {
        if (videoUrl) {
            try {
                // Fetch the video file as a blob using Axios
                const response = await axios.get(videoUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'roast-video.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url); // Clean up the URL object
            } catch (error) {
                console.error("Error downloading video:", error);
            }
        }
    };


    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800 p-6 md:p-16">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Roast My Pic!
                        </h1>
                        <p className="text-xl text-gray-300">
                            Tired of everyone talking good about you? Tell VibeVision AI to roast you instead!
                        </p>
                    </div>

                    {/* Main Content */}
                    <Card className="bg-black/20 backdrop-blur-lg border-gray-800">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left Side - Upload Form */}
                                <div className="space-y-4">
                                    {/* Upload Area */}
                                    <div className="relative">
                                        {isLoading && (
                                            <Progress value={progress} className="absolute top-0 z-10" />
                                        )}

                                        {selectedImage ? (
                                            <div className="relative">
                                                <img
                                                    src={selectedImage || 'not found'}
                                                    alt="Uploaded content"
                                                    className="w-full h-64 border-2 object-contain rounded-lg"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2"
                                                    onClick={handleDeleteImage}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                // {...getRootProps()}
                                                className={cn(
                                                    "h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer",
                                                    "transition-colors hover:border-primary",
                                                    true ? "border-primary bg-primary/10" : "border-gray-700"
                                                )}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="h-full w-full opacity-0 cursor-pointer absolute"
                                                />
                                                <Upload className="h-12 w-12 text-gray-500 mb-4" />
                                                <p className="text-gray-400">
                                                    {true ? "Drop your image here" : "Drag & drop or click to upload"}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Voice Selection */}
                                    <div className="space-y-2">
                                        <Label>Voice</Label>
                                        <Select
                                            value={selectedVoice}
                                            onValueChange={(value) => setSelectedVoice(value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a voice" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {VOICE_OPTIONS.map((voice) => (
                                                    <SelectItem key={voice.value} value={voice.value}>
                                                        <div className="flex items-center gap-2 overflow-visible">
                                                            <div>
                                                                {voice.gender === 'm' ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'>
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 3C15 2.44772 15.4477 2 16 2H20C21.1046 2 22 2.89543 22 4V8C22 8.55229 21.5523 9 21 9C20.4477 9 20 8.55228 20 8V5.41288L15.4671 9.94579C15.4171 9.99582 15.363 10.0394 15.3061 10.0767C16.3674 11.4342 17 13.1432 17 15C17 19.4183 13.4183 23 9 23C4.58172 23 1 19.4183 1 15C1 10.5817 4.58172 7 9 7C10.8559 7 12.5642 7.63197 13.9214 8.69246C13.9587 8.63539 14.0024 8.58128 14.0525 8.53118L18.5836 4H16C15.4477 4 15 3.55228 15 3ZM9 20.9963C5.68831 20.9963 3.00365 18.3117 3.00365 15C3.00365 11.6883 5.68831 9.00365 9 9.00365C12.3117 9.00365 14.9963 11.6883 14.9963 15C14.9963 18.3117 12.3117 20.9963 9 20.9963Z" fill="#3b82f6" />
                                                                    </svg> :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'>
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20 9C20 13.0803 16.9453 16.4471 12.9981 16.9383C12.9994 16.9587 13 16.9793 13 17V19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H13V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V21H10C9.44772 21 9 20.5523 9 20C9 19.4477 9.44772 19 10 19H11V17C11 16.9793 11.0006 16.9587 11.0019 16.9383C7.05466 16.4471 4 13.0803 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9ZM6.00365 9C6.00365 12.3117 8.68831 14.9963 12 14.9963C15.3117 14.9963 17.9963 12.3117 17.9963 9C17.9963 5.68831 15.3117 3.00365 12 3.00365C8.68831 3.00365 6.00365 5.68831 6.00365 9Z" fill="#ec4899" />
                                                                    </svg>
                                                                }
                                                            </div>
                                                            <span>{voice.label}</span>
                                                            <div className='relative text-nowrap group overflow-visible flex items-center'>
                                                                <HelpCircle className="h-4 w-4 text-gray-400 group" />
                                                                <div className='bg-black rounded-lg p-1 absolute left-[200%] duration-300 invisible group-hover:visible'> {voice.description} </div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Settings Button */}
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setSettingsDialogOpen(true)}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Advanced Settings
                                    </Button>
                                </div>

                                {/* Right Side - Video Preview and Controls */}
                                <div className={`gap-4 space-y-3 flex-col lg:flex-row-reverse ${videoUrl && ' flex '}`}>
                                    {/* Video Preview */}
                                    {videoUrl ? (
                                        <video
                                            src={videoUrl}
                                            controls
                                            className="w-full h-[396px] rounded-lg object-contain bg-black"
                                        />
                                    ) : isLoading ?
                                        (
                                            <div className="w-full h-64 rounded-lg bg-black/30 flex flex-col items-center justify-center">
                                                <div
                                                    className="p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-20 md:h-20 h-16 w-16 aspect-square rounded-full"
                                                >
                                                    <div
                                                        className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"
                                                    ></div>
                                                </div>

                                                <div className="loader">
                                                    <p>Generating</p>
                                                    <div className="words">
                                                        <span className="word">Roast</span>
                                                        <span className="word">Audio</span>
                                                        <span className="word">Video</span>
                                                        <span className="word">Caption</span>
                                                        <span className="word">Content</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="w-full h-64 rounded-lg bg-black/30 flex items-center justify-center">
                                                <p className="text-gray-400">Your roast video will appear here</p>
                                            </div>
                                        )}

                                    {/* Action Buttons */}
                                    <div className="gap-3 flex flex-col-reverse justify-end">
                                        <div className="space-y-3">

                                            {videoUrl && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button
                                                        variant="secondary"

                                                        onClick={handleDownloadVideo}
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => setShareDialogOpen(true)}
                                                    >
                                                        <Share className="mr-2 h-4 w-4" />
                                                        Share
                                                    </Button>
                                                </div>
                                            )}

                                            {!isVideoGenerated && <Button
                                                className="w-full"
                                                onClick={handleGenerate}
                                                disabled={!imageFile || isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Generate Roast Video
                                                    </>
                                                )}
                                            </Button>}
                                        </div>

                                        {/* Status Message */}
                                        {statusMessage && (
                                            <Alert>
                                                <AlertDescription>{statusMessage}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Generated Script Display */}
                                        {roastScript && (
                                            <ScrollArea className="bg-black/20 flex-1 max-h-80">
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Generated Script:</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-300">{roastScript}</p>
                                                </CardContent>
                                            </ScrollArea>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Dialog */}
                    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Advanced Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label>Video Duration (seconds)</Label>
                                    <Slider
                                        value={[settings.duration]}
                                        onValueChange={([value]) =>
                                            setSettings(prev => ({ ...prev, duration: value }))
                                        }
                                        max={120}
                                        min={5}
                                        step={1}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Current: {settings.duration} seconds
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Roast Style</Label>
                                    <Select
                                        value={settings.roastStyle}
                                        onValueChange={(value) =>
                                            setSettings(prev => ({ ...prev, roastStyle: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="funny">Funny</SelectItem>
                                            <SelectItem value="witty">Witty</SelectItem>
                                            <SelectItem value="sarcastic">Sarcastic</SelectItem>
                                            <SelectItem value="playful">Playful</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setSettingsDialogOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Share Dialog */}
                    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share Video</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center gap-4 py-4">
                                <Button variant="outline" size="icon" onClick={() =>
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`)
                                }>
                                    <Facebook className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() =>
                                    window.open(`https://twitter.com/intent/tweet?url=${videoUrl}`)
                                }>
                                    <Twitter className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() =>
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${videoUrl}`)
                                }>
                                    <Linkedin className="h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() =>
                                    window.open(`https://wa.me/?text=${encodeURIComponent(videoUrl)}`)
                                }>
                                    <Youtube className="h-5 w-5" />
                                </Button>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setShareDialogOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Alert */}
                    {false && alert.show && (
                        <Alert
                            // variant={alert.variant}
                            className="fixed bottom-4 left-4 max-w-md animate-in fade-in slide-in-from-bottom-4"
                        >
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    )}

                    <MessageToast
                        message="Your creation is in progress! You can keep track in your profile."
                        visible={toastVisible}
                        onClose={() => setToastVisible(false)}
                    />
                </div>
            </div>
        </Layout>
    );
}