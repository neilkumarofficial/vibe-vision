'use client';

import React, { useState } from 'react';
import { Music, Play, ChevronLeft, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "../../../components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Layout } from '../../../components/layout/layout';

// Simulated API call for song creation
const createSong = async (songData: any): Promise<Song> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                title: `Song for ${songData.name || 'Someone Special'}`,
                artist: 'AI Artist',
                imageUrl: `/api/placeholder/100/100?random=${Date.now()}`,
                genre: songData.genre || 'Pop',
                duration: Math.floor(Math.random() * 180) + 120, // Random duration between 2-5 minutes
                audioUrl: '/path-to-generated-audio.mp3', // This would be the actual generated audio URL
            });
        }, 2000);
    });
};

interface Song {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    genre: string;
    duration: number;
    audioUrl: string;
}

interface IdeaType {
    icon: string;
    title: string;
    description: string;
}

const SongCreationPage = () => {
    const [description, setDescription] = useState('');
    const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
    const [activeIdea, setActiveIdea] = useState<IdeaType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        relationship: '',
        favoriteThing: '',
        funniestThing: '',
        genre: 'pop'
    });

    const genres = [
        'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic',
        'R&B', 'Country', 'Folk', 'Latin', 'Blues', 'Metal'
    ];

    const ideas: IdeaType[] = [
        { icon: '👤', title: 'Person', description: 'Celebrate a special person in your life' },
        { icon: '🎉', title: 'Special Occasions', description: 'Mark a birthday, holiday, or life event' },
        { icon: '🎵', title: 'Activity', description: 'Create a jam for your next hangout or party' },
        { icon: '💌', title: 'Greeting', description: 'Say thank you, congrats, or get well soon' },
        { icon: '✈️', title: 'Vacation', description: 'Get excited for your next fun trip' },
        { icon: '📸', title: 'Scrapbook', description: 'Commemorate your treasured memories' },
        { icon: '🐾', title: 'Pet', description: 'Celebrate your cute and quirky pet' },
    ];

    const handleCreate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const songData = activeIdea ? formData : { description };
            const newSong = await createSong(songData);
            setGeneratedSongs([newSong, ...generatedSongs]);
            setActiveIdea(null);
        } catch (err) {
            setError('Failed to create song. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };;

    const renderIdeaForm = () => (
        <div className="space-y-6 mt-6">
            <div>
                <Label>I&apos;m celebrating</Label>
                <Input
                    placeholder="NAME OF PERSON"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div>
                <Label>My relationship</Label>
                <Input
                    placeholder="RELATIONSHIP TO PERSON"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                />
            </div>

            <div>
                <Label>My favorite thing about them is</Label>
                <Input
                    placeholder="FAVORITE THING ABOUT THEM"
                    value={formData.favoriteThing}
                    onChange={(e) => setFormData({ ...formData, favoriteThing: e.target.value })}
                />
            </div>

            <div>
                <Label>The funniest thing about them is</Label>
                <Input
                    placeholder="FUNNIEST THING ABOUT THEM"
                    value={formData.funniestThing}
                    onChange={(e) => setFormData({ ...formData, funniestThing: e.target.value })}
                />
            </div>

            <div>
                <Label>Their favorite genre of music is</Label>
                <Select
                    value={formData.genre}
                    onValueChange={(value) => setFormData({ ...formData, genre: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                        {genres.map((genre) => (
                            <SelectItem key={genre.toLowerCase()} value={genre.toLowerCase()}>
                                {genre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = (song: Song) => {
        if (currentSong?.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex bg-gradient-to-b from-background via-purple-900/20 to-background pt-28 pl-10">
                {/* Left side - Form and Ideas */}
                <div className="w-1/2 p-16 ">
                    <AnimatePresence mode="wait">
                        {!activeIdea ? (
                            <motion.div
                                key="main-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <h1 className="text-4xl font-bold">Create a Song</h1>
                                <div className="space-y-2">
                                    <Label>Song Description</Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="a syncopated hip hop song about dancing with you for the last time"
                                        className="h-32"
                                    />
                                    <p className="text-sm text-muted-foreground text-right">
                                        {description.length} / 200
                                    </p>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg"
                                    onClick={handleCreate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Music className="mr-2" />
                                            Create
                                        </>
                                    )}
                                </Button>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idea-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveIdea(null)}
                                    className="mb-4"
                                >
                                    <ChevronLeft className="mr-2" /> Back to ideas
                                </Button>
                                {renderIdeaForm()}
                                <Button
                                    size="lg"
                                    className="w-full mt-6 h-14 text-lg"
                                    onClick={handleCreate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Music className="mr-2" />
                                            Create
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Need ideas section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Need ideas?</h2>
                        <div className="space-y-2">
                            {ideas.map((idea, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="w-full justify-start text-left h-auto py-4"
                                    onClick={() => setActiveIdea(idea)}
                                >
                                    <span className="text-2xl mr-4">{idea.icon}</span>
                                    <div>
                                        <div className="font-medium">{idea.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {idea.description}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side - Generated Songs */}
                <div className="w-1/2 p-8 pt-20 bg-background/50">
                    <h2 className="text-2xl font-semibold mb-6">Generated Songs</h2>
                    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {generatedSongs.map((song) => (
                            <Card key={song.id} className="bg-card/50 backdrop-blur">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                            <img
                                                src={song.imageUrl}
                                                alt={song.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{song.title}</h3>
                                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                                            <p className="text-xs text-muted-foreground">Genre: {song.genre}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePlayPause(song)}
                                    >
                                        {currentSong?.id === song.id && isPlaying ? (
                                            <Pause className="h-6 w-6" />
                                        ) : (
                                            <Play className="h-6 w-6" />
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Music Player */}
                {/* <MusicPlayer
                    song={currentSong}
                    isPlaying={isPlaying}
                    onPlayPause={setIsPlaying}
                    onClose={() => {
                        setCurrentSong(null);
                        setIsPlaying(false);
                    }}
                /> */}
            </div>
        </Layout>
    );
};

export default SongCreationPage;