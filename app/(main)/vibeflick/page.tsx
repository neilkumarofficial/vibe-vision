"use client"
import { Layout } from "@/components/layout/layout";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShortsPlayer } from "@/components/viveflicks-player";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

// Define the type for a Short video
interface Short {
    videoUrl: string;
    title: string;
    channelName: string;
    likes: string;
    comments: string;
    views: string;
    postedDate: string;
    channelAvatar: string;
    hashtags: string[];
    description: string;
    duration: string;
    isVerified: boolean;
    category: string;
    shareCount: string;
}

// Demo shorts data
const demoShorts: Short[] = [
    {
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        title: "Why did Scott Lang bring an orange slice for Clint in Endgame???",
        channelName: "vibe vision",
        likes: "667K",
        comments: "445",
        views: "2.3M",
        postedDate: "2 days ago",
        channelAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&auto=format&fit=crop",
        hashtags: ["#Marvel", "#Endgame", "#ScottLang"],
        description: "In this video, we dive deep into the hilarious yet mysterious orange slice scene from Endgame. Is there a deeper meaning behind Scott Lang's gesture?",
        duration: "01:23",
        isVerified: true,
        category: "Entertainment",
        shareCount: "123K",
    },
    {
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        title: "Another Interesting Short",
        channelName: "cool creators",
        likes: "300K",
        comments: "200",
        views: "1.5M",
        postedDate: "1 day ago",
        channelAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop",
        hashtags: ["#Creativity", "#Shorts"],
        description: "Another exciting short video to keep you entertained!",
        duration: "00:45",
        isVerified: false,
        category: "Creativity",
        shareCount: "50K",
    }
];

export default function ShortsPage() {
    // State to track the current short video index
    const [currentShortIndex, setCurrentShortIndex] = useState(0);

    // Function to navigate to the next short video
    const handleNextShort = () => {
        setCurrentShortIndex((prevIndex) => 
            // Use modulo to wrap around to the first video when reaching the end
            (prevIndex + 1) % demoShorts.length
        );
    };

    // Function to navigate to the previous short video
    const handlePreviousShort = () => {
        setCurrentShortIndex((prevIndex) => 
            // Use modulo with addition to handle negative index wrap-around
            (prevIndex - 1 + demoShorts.length) % demoShorts.length
        );
    };

    return (
        <Layout>
            <main className="min-h-screen bg-black flex items-center justify-center p-4 relative">
                {/* Sparkle background effect */}
                <div className="absolute inset-0 z-0">
                    <SparklesCore
                        id="shorts-page-sparkles"
                        background="purple"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={100}
                        particleColor="#FFFFFF"
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-10">
                    {/* Previous Short Button */}
                    <button 
                        onClick={handlePreviousShort}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-300"
                        aria-label="Previous Short"
                    >
                        <ChevronUp size={24} />
                    </button>
                    
                    {/* Next Short Button */}
                    <button 
                        onClick={handleNextShort}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-300"
                        aria-label="Next Short"
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>

                {/* Shorts Player Container */}
                <div className="absolute w-full max-w-md">
                    {/* Pass the current short's data to the ShortsPlayer component */}
                    <ShortsPlayer 
                        {...demoShorts[currentShortIndex]} 
                        key={currentShortIndex} // Add key to force re-render and reset video
                    />
                </div>
            </main>
        </Layout>
    );
}