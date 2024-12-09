import React, { useRef, useEffect } from 'react';// Adjust for your utility function
import { Button } from '../ui/button';
import { AudioLinesIcon, ChevronDown, Image, Share, Video, X } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import axios from 'axios';

interface VideoPlayerProps {
    isVisible: boolean;
    currentVideoUrl: string | null;
    currentVideoContent: ContentItem | null;
    onClose: () => void;
    setShowShareDialog: (show: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    isVisible,
    currentVideoUrl,
    currentVideoContent,
    onClose,
    setShowShareDialog,
}) => {
    const videoModalRef = useRef<HTMLDivElement>(null);

    // Close modal on clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (videoModalRef.current && !videoModalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    function formatDateTime(isoDate: string): string {
        const date = new Date(isoDate);

        // Format the date to a readable string
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long", // Full name of the day (e.g., "Monday")
            year: "numeric",
            month: "long",   // Full name of the month (e.g., "January")
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            // timeZoneName: "short" // Includes the time zone abbreviation (e.g., "GMT")
        };

        return date.toLocaleString("en-US", options);
    }

    const handleDownloadAudio = async (audioUrl: string | null, displayName: string) => {
        if (audioUrl) {
            try {
                // Fetch the video file as a blob using Axios
                const response = await axios.get(audioUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${displayName}.mp3`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url); // Clean up the URL object
            } catch (error) {
                console.error("Error downloading audio:", error);
            }
        }
    };

    const handleDownloadVideo = async (videoUrl: string | null, displayName: string) => {
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
                a.download = `${displayName}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url); // Clean up the URL object
            } catch (error) {
                console.error("Error downloading video:", error);
            }
        }
    };

    const handleDownloadImage = async (imageUrl: string | null, displayName: string) => {
        if (imageUrl) {
            try {
                const response = await axios.get(imageUrl, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], { type: 'image/png' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${displayName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading image:", error);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed z-50 h-screen w-screen p-0 xl:px-44 xl:py-20 top-0 left-0 bg-black/20 backdrop-blur flex justify-center items-center">
            <div
                ref={videoModalRef}
                className="relative bg-neutral-900 p-4 pt-12 xl:p-8 gap-4 xl:gap-8 w-full h-full xl:rounded-xl flex flex-col xl:flex-row justify-center items-center object-contain" >
                <Button
                    className="absolute bg-neutral-900 xl:bg-transparent xl:w-8 xl:h-8 z-10 top-2 right-2"
                    onClick={onClose} >
                    <ChevronDown className="flex xl:hidden" />
                    <X className="xl:flex hidden" />
                </Button>
                <video
                    src={currentVideoUrl || ''}
                    controls
                    className="xl:h-full xl:max-w-96 xs:max-h-96 max-h-72 xl:max-h-full rounded-xl object-contain" />
                <ScrollArea className="flex-1 h-full rounded-xl overflow-y-auto">
                    <div className="flex flex-col gap-4 bg-neutral-950 rounded-xl h-full p-4 xl:p-8 overflow-y-auto">
                        <h1 className="text-2xl">Video Description</h1>
                        <div className="flex flex-col 2xl:flex-row py-4 items-start justify-between">
                            <div className="text-xl">
                                {currentVideoContent?.contentType === 'story-time'
                                    ? currentVideoContent?.userPrompt
                                    : currentVideoContent?.displayName || 'Video Name'}
                            </div>
                            <div className="text-lg opacity-60">
                                {formatDateTime(currentVideoContent?.createdAt || '00:00:00')}
                            </div>
                        </div>
                        <div className="text-lg bg-neutral-900 p-4 rounded-xl">
                            User Prompt <br />
                            {currentVideoContent?.userPrompt || 'no prompt'}
                        </div>
                        <div className="text-lg bg-neutral-900 p-4 rounded-xl">
                            Generated Text
                            <br /> {currentVideoContent?.enhancedPrompt || 'no prompt'}
                        </div>
                        <div className="gap-4 flex flex-auto flex-col xl:flex-row w-full">
                            {currentVideoContent?.contentType === 'roast-my-pic' && (
                                <div className="p-8 rounded-xl flex flex-col items-center gap-6 bg-neutral-900 w-full">
                                    Image Used
                                    <img
                                        src={`${currentVideoContent?.imageUrl}`}
                                        className="size-44 rounded-xl object-cover duration-200 hover:scale-105 cursor-pointer"
                                        onClick={() => {
                                            window.open(`${currentVideoContent?.imageUrl}`, '_blank');
                                        }}
                                        alt="No Image Found"
                                    />
                                </div>
                            )}
                            <div className="fle/x gap-4 flex-col w-full h-full hidden">
                                <Button
                                    className="w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl"
                                    onClick={() =>
                                        handleDownloadVideo(
                                            `${currentVideoContent?.videoUrl || ''}`,
                                            currentVideoContent?.displayName || 'Roast Video'
                                        )
                                    }
                                >
                                    <Video className="size-4" />
                                    Download Video
                                </Button>
                                {currentVideoContent?.contentType === 'roast-my-pic' && (
                                    <>
                                        <Button
                                            className="w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl"
                                            onClick={() =>
                                                handleDownloadAudio(
                                                    `${currentVideoContent?.audioUrl || ''}`,
                                                    currentVideoContent?.displayName || 'Roast Audio'
                                                )
                                            }
                                        >
                                            <AudioLinesIcon className="size-4" />
                                            Download Audio
                                        </Button>
                                        <Button
                                            className="w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl"
                                            onClick={() =>
                                                handleDownloadImage(
                                                    `${currentVideoContent?.imageUrl || ''}`,
                                                    currentVideoContent?.displayName || 'Roast Image'
                                                )
                                            }
                                        >
                                            <Image className="size-4" />
                                            Download Image
                                        </Button>
                                    </>
                                )}
                            </div>
                            <Button
                                className="w-full xl:h-full p-4 bg-neutral-900 flex xl:flex-col justify-center items-center gap-4 rounded-xl"
                                onClick={() => setShowShareDialog(true)}
                            >
                                <Share className="size-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};
