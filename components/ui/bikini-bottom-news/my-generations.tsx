import React, { useState } from "react";
import { Button } from "../button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, ChevronUp, RotateCw, TriangleAlert } from "lucide-react";

interface MyGenerationsProps {
    filteredData?: ContentItem[]; // Make filteredData optional
    fetchData: () => void;
}

const MyGenerations: React.FC<MyGenerationsProps> = ({ 
    filteredData = [], // Provide a default empty array
    fetchData 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openCard, setOpenCard] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        setOpenCard(openCard === id ? null : id);
    };

    function formatDateTime(isoDate: string): { relativeTime: string, formattedDate: string } {
        const date = new Date(isoDate);
        const now = new Date();

        const timeDifference = now.getTime() - date.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Format the actual date for user-friendly readability
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",  // Abbreviated day (e.g., "Mon")
            month: "short",    // Abbreviated month (e.g., "Jan")
            day: "numeric",    // Numeric day (e.g., "25")
            year: "numeric",   // Full year (e.g., "2024")
            hour: "2-digit",   // Hour in 12-hour format
            minute: "2-digit", // Minutes
            hour12: true       // Display AM/PM
        });

        let relativeTime = "";

        if (days >= 1) {
            // More than or equal to one day ago
            relativeTime = days === 1 ? "1 day ago" : `${days} days ago`;
        } else if (hours >= 1) {
            // Within the same day, show hours ago
            relativeTime = `${hours} hours ago`;
        } else if (minutes >= 1) {
            // Within the last hour, show minutes ago
            relativeTime = `${minutes} minutes ago`;
        } else {
            // Within the last minute, show seconds ago
            relativeTime = `${seconds} seconds ago`;
        }

        return {
            relativeTime,
            formattedDate
        }
    }

    return (
        <Card className="bg-black/20 py-4 backdrop-blur-lg border-gray-800">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4">
                <span className="text-xl">My Generations</span>
                <div className="flex flex-row gap-2">
                    <Button
                        onClick={fetchData}
                        variant="secondary"
                        className="flex items-center gap-2" >
                        <RotateCw />
                    </Button>
                    <Button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        variant="secondary"
                        className="flex items-center gap-2" >
                        {isCollapsed ?
                            <ChevronDown />
                            :
                            <ChevronUp />
                        }
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            {!isCollapsed && (
                <div className="flex flex-col md:flex-row overflow-auto max-h-[800px] md:overflow-x-auto md:overflow-y-hidden gap-0 p-0">
                    {filteredData.length > 0 ? (
                        filteredData.map((dataItem) => (
                            <div
                                key={dataItem._id}
                                className="md:aspect-video md:h-80 bg-gradient-to-br from-purple-950/50 via-gray-950 to-purple-950/50"
                            >
                                {/* Success State */}
                                {dataItem.status === "success" && (
                                    <div className="border-y-2 border-r-2 bg-neutral-950 size-full p-4">
                                            <div
                                                className="flex items-center max-h-20 justify-between size-full cursor-pointer md:hidden md:cursor-default"
                                                onClick={() => toggleCard(dataItem._id)} >
                                                <div className="flex flex-row gap-2 items-center">

                                                    {(openCard !== dataItem._id) && <div
                                                        style={{
                                                            backgroundImage: `url(${dataItem.imageUrl || dataItem.thumbnail_alt || 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'})`,
                                                        }}
                                                        className="size-20 bg-cover rounded-lg relative aspect-square">
                                                        {
                                                            dataItem.imageUrl || dataItem.thumbnail_alt ?
                                                                null
                                                                :
                                                                <div className="size-full absolute bg-black/80 z-50 rounded-xl text-center flex items-center justify-center text-white p-4">
                                                                    404 Not Found
                                                                </div>
                                                        }
                                                    </div>}
                                                    <div className="text-sm flex flex-col gap-1 h-full w-full p-2 mr-12 text-justify">
                                                        <span className="text-gray-300 flex">
                                                            {formatDateTime(dataItem.createdAt).relativeTime}
                                                            <span className="hidden sm:block">{`\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0${formatDateTime(dataItem.createdAt).formattedDate}`}</span>
                                                        </span>
                                                        {(openCard !== dataItem._id) && <div className="line-clamp-2 text-gray-400"><span> {dataItem.enhancedPrompt} </span> </div>}
                                                    </div>
                                                </div>
                                                <div className="text-gray-400 md:hidden h-full">
                                                    {openCard === dataItem._id ?
                                                        <ChevronUp />
                                                        :
                                                        <ChevronDown />
                                                    }
                                                </div>
                                            </div>

                                            {/* Accordion Content */}
                                            <div
                                                className={`h-full max-h-[600px/] flex-col md:flex-row flex gap-4 mt-4 md:mt-0 items-center ${openCard === dataItem._id ? "block" : "hidden"
                                                    } md:flex`}
                                            >
                                                {/* Conditionally render video */}
                                                {dataItem.videoUrl && (
                                                    <video
                                                        src={dataItem.videoUrl}
                                                        controls
                                                        className="w-full max-w-[240px] h-full rounded-lg object-contain bg-black"
                                                    />
                                                )}

                                                <div className="flex flex-col gap-4 h-full">
                                                    <Card className="px-8 py-3 border-none bg-neutral-900 hidden md:block">
                                                        <span className="text-gray-300 flex text-left text-sm">
                                                            {`${formatDateTime(dataItem.createdAt).relativeTime}\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0${formatDateTime(dataItem.createdAt).formattedDate}`}
                                                        </span>
                                                    </Card>
                                                    <ScrollArea className="bg-neutral-900 h-full rounded-xl p-2 overflow-x-auto max-h-64 md:max-h-full">
                                                        <div className="overflow-/clip w-full h-full text-justify">
                                                            <CardHeader>
                                                                <CardTitle className="text-lg">Generated Script:</CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <p className="text-gray-300">{dataItem.enhancedPrompt}</p>
                                                            </CardContent>
                                                            <CardFooter>
                                                            </CardFooter>
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Waiting State */}
                                    {dataItem.status === "waiting" && (
                                        <div className="size-full p-4 bg-black/30 border border-purple-500 flex items-center justify-between">
                                            <div className="flex flex-row size-full items-center">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${dataItem.imageUrl || dataItem.thumbnail_alt || 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'})`,
                                                    }}
                                                    className="size-20 bg-cover block md:hidden rounded-lg relative aspect-square">
                                                    {
                                                        dataItem.imageUrl || dataItem.thumbnail_alt ?
                                                            null
                                                            :
                                                            <div className="size-full absolute bg-black/80 z-50 rounded-xl text-center flex items-center justify-center text-white p-4">
                                                                404 Not Found
                                                            </div>
                                                    }
                                                </div>

                                                <div className="text-sm flex flex-col h-full px-4 md:hidden">
                                                    <span className="text-gray-300 flex md:hidden md:justify-center text-sm">
                                                        {formatDateTime(dataItem.createdAt).relativeTime}
                                                        <span className="hidden sm:flex">{`\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0${formatDateTime(dataItem.createdAt).formattedDate}`}</span>
                                                    </span>
                                                    <h2 className="text-zinc-900 md:text-lg dark:text-white">
                                                        The AI is brainstorming… and it's got some wild ideas! 💭🌟
                                                    </h2>
                                                </div>

                                                <div className="md:flex flex-col items-center justify-center size-full p-2 hidden">
                                                    <div className="p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-20 md:h-20 h-16 w-16 aspect-square rounded-full">
                                                        <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
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
                                                    <h2 className="text-zinc-900 dark:text-white">
                                                        The AI is brainstorming… and it's got some wild ideas! 💭🌟
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="p-2 animate-spin block md:hidden drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 h-12 w-12 aspect-square rounded-full">
                                                <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Failure State */}
                                    {dataItem.status === "failure" && (
                                        <CardContent className="border border-red-500/80 bg-red-900/30 min-h-28 relative md:text-center flex flex-row md:flex-col items-center justify-center size-full p-4">
                                            <div className="flex flex-row md:flex-col items-center gap-4 size-full md:h-fit">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${dataItem.imageUrl || dataItem.thumbnail_alt || 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg'})`,
                                                    }}
                                                    className="size-20 flex items-center justify-center bg-cover rounded-lg relative aspect-square">
                                                    <TriangleAlert className="size-12 hidden md:block  absolute aspect-square text-red-500" />
                                                    {
                                                        dataItem.imageUrl || dataItem.thumbnail_alt ?
                                                            null
                                                            :
                                                            <div className="size-full absolute bg-black/80 z-50 rounded-xl text-center flex items-center justify-center text-white p-4">
                                                                404 Not Found
                                                            </div>
                                                    }
                                                </div>
                                                <div className="text-sm flex flex-col h-full md:h-fit">
                                                    <span className="text-gray-300 flex md:hidden md:justify-center text-sm">
                                                        {formatDateTime(dataItem.createdAt).relativeTime}
                                                        <span className="hidden sm:flex">{`\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0${formatDateTime(dataItem.createdAt).formattedDate}`}</span>
                                                    </span>
                                                    <h2 className="text-zinc-900 md:text-lg dark:text-white">
                                                        Error Generating Content!
                                                    </h2>
                                                    <p className="text-gray-600 dark:text-gray-300 md:text-base">
                                                        The server wasn't able to generate your {dataItem.contentType}!
                                                    </p>
                                                    <span className="text-zinc-400 md:flex hidden md:justify-center text-sm">
                                                        {formatDateTime(dataItem.createdAt).relativeTime}
                                                        <span className="hidden sm:flex">{`\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0${formatDateTime(dataItem.createdAt).formattedDate}`}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <TriangleAlert className="size-12 block md:hidden aspect-square text-red-500" />
                                        </CardContent>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col w-full items-center justify-center gap-4 text-gray-300 h-96">
                                <img
                                    className="size-20 opacity-60"
                                    src="https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/external-mount-fuji-wonder-of-the-world-vitaliy-gorbachev-blue-vitaly-gorbachev.png"
                                    alt="Nothing to see here"
                                />
                                Nothing to see here
                            </div>
                        )}
                    </div>
                )
            }
        </Card>
    );
};

export default MyGenerations;