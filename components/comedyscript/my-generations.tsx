import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, RotateCw, FileText, Maximize2, Download } from "lucide-react";
import { generatePDF, downloadPDF } from "@/lib/pdf";

interface ComedyScriptGenerationItem {
    id: string;
    title: string;
    contentType: string;
    createdAt: Date;
    content: string;
}

interface MyGenerationsProps {
    data?: ComedyScriptGenerationItem[];
    fetchData?: () => void;
}

const MyGenerations: React.FC<MyGenerationsProps> = ({ 
    data = [], 
    fetchData 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openCard, setOpenCard] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        setOpenCard(openCard === id ? null : id);
    };

    const downloadScript = async (script: string, format: 'pdf' | 'doc') => {
        try {
            if (format === 'pdf') {
                const blob = await generatePDF(script);
                downloadPDF(blob, 'comedy-script.pdf');
            } else {
                const blob = new Blob([script], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'comedy-script.doc';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    function formatDateTime(date: Date): { relativeTime: string, formattedDate: string } {
        const now = new Date();
        const timeDifference = now.getTime() - date.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        let relativeTime = "";

        if (days >= 1) {
            relativeTime = days === 1 ? "1 day ago" : `${days} days ago`;
        } else if (hours >= 1) {
            relativeTime = `${hours} hours ago`;
        } else if (minutes >= 1) {
            relativeTime = `${minutes} minutes ago`;
        } else {
            relativeTime = `${seconds} seconds ago`;
        }

        return { relativeTime, formattedDate };
    }

    return (
        <Card className="w-full flex flex-col bg-black/20 py-4 backdrop-blur-lg border-gray-800">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4">
                <span className="text-xl flex items-center gap-2">
                    <FileText className="h-6 w-6" /> My Comedy Scripts
                </span>
                <div className="flex  gap-2">
                    <TooltipProvider>
                        {fetchData && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={fetchData}
                                        variant="secondary"
                                        size="icon"
                                        className="w-10 h-10"
                                    >
                                        <RotateCw className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Refresh Generations</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    variant="secondary"
                                    size="icon"
                                    className="w-10 h-10"
                                >
                                    {isCollapsed ? <ChevronDown /> : <ChevronUp />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isCollapsed ? 'Expand' : 'Collapse'} Generations</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Main Content */}
            {!isCollapsed && (
                <div className="flex w-full overflow-auto max-h-[800px] gap-4 p-4">
                    {data.length > 0 ? (
                        data.map((script) => (
                            <Card 
                                key={script.id} 
                                className="w-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="sm:block hidden">{script.title}</CardTitle>
                                        <span className="text-sm text-gray-400 sm:block hidden">
                                            {formatDateTime(script.createdAt).relativeTime}
                                        </span>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="sm:hidden block">
                                                    <Maximize2 className="h-4 w-4 mr-2" /> View Script
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[825px] w-full max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>{script.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex justify-end space-x-2 mb-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => downloadScript(script.content, 'pdf')}
                                                    >
                                                        <Download className="h-4 w-4 mr-2" /> PDF
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => downloadScript(script.content, 'doc')}
                                                    >
                                                        <FileText className="h-4 w-4 mr-2" /> DOC
                                                    </Button>
                                                </div>
                                                <pre className="whitespace-pre-wrap font-mono text-sm">
                                                    {script.content}
                                                </pre>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="sm:block hidden">
                                    <ScrollArea className="h-48 overflow-y-auto pr-4">
                                        <p className="text-gray-300 line-clamp-4">
                                            {script.content}
                                        </p>
                                    </ScrollArea>
                                </CardContent>
                                <CardFooter className="justify-between items-center sm:flex hidden">
                                    <span className="text-xs text-gray-500">
                                        {script.contentType}
                                    </span>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                View Full Script
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[825px] w-full max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>{script.title}</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex justify-end space-x-2 mb-4">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => downloadScript(script.content, 'pdf')}
                                                >
                                                    <Download className="h-4 w-4 mr-2" /> PDF
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => downloadScript(script.content, 'doc')}
                                                >
                                                    <FileText className="h-4 w-4 mr-2" /> DOC
                                                </Button>
                                            </div>
                                            <pre className="whitespace-pre-wrap font-mono text-sm">
                                                {script.content}
                                            </pre>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col w-full items-center justify-center gap-4 text-gray-300 h-96">
                            <FileText className="h-20 w-20 opacity-60" />
                            No comedy scripts generated yet
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default MyGenerations;