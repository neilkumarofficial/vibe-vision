'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  ChevronUp,
  ChevronDown,
  Download,
  Shuffle,
  Info,
  Minimize2,
  Maximize2,
  MicVocal
} from 'lucide-react';
import SongLyrics from '../ui/song-lyrics';
import axios from 'axios';

// Define an interface for playlist items
interface PlaylistItem {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverArt: string;
}

// Format time function with type annotation
const formatTime = (time: number | null): string => {
  if (time === null || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Default playlist with type annotation
const defaultPlaylist: PlaylistItem[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "The Cosmic Band",
    album: "Stellar Journeys",
    duration: 245,
    coverArt: "/api/placeholder/300/300"
  },
  {
    id: 2,
    title: "Neon Lights",
    artist: "Electronic Minds",
    album: "Digital Era",
    duration: 198,
    coverArt: "/api/placeholder/300/300"
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Nature Sounds",
    album: "Peaceful Moments",
    duration: 324,
    coverArt: "/api/placeholder/300/300"
  }
];

interface Song {
  id: string;
  title: string;
  genres: string[];
  coverArt: string;
  audioUrl: string;
  duration: number;
  timestamp: string;
  lyrics: string;
}

interface CurrentSong {
  currentSong: Song | null
}

export default function EnhancedMusicPlayer({ currentSong }: CurrentSong) {
  // State management with types
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [playlist] = useState<PlaylistItem[]>(defaultPlaylist);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  // const [showLyrics, setShowLyrics] = useState<boolean>(false)



  // -------------------------------------------------------------------------------


  // const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
  // const currentSong: Song | null = currentSongIndex !== null ? generatedSongs[currentSongIndex] : null;
  const playerScreenRef = useRef<HTMLDivElement>(null)
  const [isMusicPlayerFullScreen, setIsMusicPlayerFullScreen] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isTouchDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const isMobileDevice = (): boolean => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const maximizeScreen = (): void => {
    if (isTouchDevice() || isMobileDevice()) {
      setIsMusicPlayerFullScreen(true);
      return;
    }

    if (playerScreenRef.current) {
      const element = playerScreenRef.current as HTMLElement;

      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen(); // For Firefox
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen(); // For Safari
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen(); // For Internet Explorer/Edge
      }
    }

    setIsMusicPlayerFullScreen(true);
  };

  const minimizeScreen = (): void => {
    if (isTouchDevice() || isMobileDevice()) {
      setIsMusicPlayerFullScreen(false);
      return;
    }

    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen(); // For Firefox
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen(); // For Safari
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen(); // For Internet Explorer/Edge
      }
    }

    setIsMusicPlayerFullScreen(false);
  };


  const handleShowLyrics = () => {
    setShowLyrics(val => !val)
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

  //-----------------------------------------------------------------------------

  // const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current ? audioRef.current.duration : 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0);
      });
      audioRef.current.addEventListener('ended', handleSongEnd);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, [currentSongIndex, isRepeat, isShuffle]);

  const handleSongEnd = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentSongIndex(nextIndex);
    } else {
      handleNext();
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex(prev => (prev < playlist.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
    } else if (currentSongIndex > 0) {
      setCurrentSongIndex(prev => prev - 1);
    } else {
      setCurrentSongIndex(playlist.length - 1);
    }
    setIsPlaying(true);
  };

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {
        currentSong && (
          <div
            ref={playerScreenRef}
            className={`fixed bottom-0 left-0 right-0 flex flex-col-reverse bg-background backdrop-blur border-t ${isMusicPlayerFullScreen && 'h-screen w-screen top-0'}`}>
            {/* {isMusicPlayerFullScreen && <div
              style={{ backgroundImage: `url(${currentSong.coverArt || imageUrl})` }}
              className='w-full h-full absolute pointer-events-none bg-cover blur-md opacity-40' />} */}
            {isMusicPlayerFullScreen &&
              <div className='absolute top-4 flex w-full justify-center px-4'>
                <div className='w-full flex justify-between'>
                  <Button
                    variant="ghost"
                    // size="icon"
                    onClick={minimizeScreen}
                    className={`hover:text-white 'text-gray-400' scale-150/ flex`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleShowLyrics}
                    className={`hover:text-white 'text-gray-400' scale-150/ bg-red-400/ flex`} >
                    <MicVocal className="h-5 w-5" />
                    Lyrics
                    {
                      showLyrics ?
                        <ChevronUp className="h-5 w-5" />
                        :
                        <ChevronDown className="h-5 w-5" />
                    }
                  </Button>
                </div>

                {showLyrics &&
                  <div className='absolute flex flex-col gap-2 top-full bg-black/80 rounded-lg border p-4 border-gray-800 z-10 md:right-0 h-[480px] m-4 w-96'>
                    <div className='text-xl px-4 pt-2' >Lyrics</div>
                    <ScrollArea
                      className='size-full p-4'>
                      <SongLyrics lyrics={currentSong.lyrics} bgImage={currentSong.coverArt} />
                    </ScrollArea>
                  </div>
                }
              </div>
            }



            <div
              style={{ backgroundImage: isMusicPlayerFullScreen ? `url(${currentSong.coverArt})` : '', }}
              className='absolute w-full h-full bg-no-repeat bg-cover opacity-30 md:opacity-30 blur-md pointer-events-none'>
            </div>

            <Progress
              value={(currentTime / duration) * 100}
              className="h-1"
            />

            {isMusicPlayerFullScreen ?
              // <div className="p-4 w-full">
              <div className="flex items-center h-full/ w-full justify-center flex-col gap-4 py-16 px-8 md:px-16 relative">

                {/* Song Info */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full min-w-[240px] md:m-20">
                  {!(isMobileDevice() || isTouchDevice()) && <img
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    className="size-full md:size-48 rounded"
                  />}
                  <div className='flex flex-col justify-end w-full h-full md:px-8 md:gap-4'>
                    {/* <ScrollingText text={currentSong.title} /> */}
                    <h3 className="font-bold text-base md:text-5xl">{currentSong.title}</h3>
                    <h3 className="font-bold text-xs opacity-50">VibeVision Music.</h3>
                    {/* <p className="text-sm text-gray-400">
                                            {currentSong.genres.join(', ')}
                                        </p> */}
                  </div>
                </div>

                {/* Player Controls */}
                <div className="w-full">
                  <div className="flex flex-col items-center gap-2">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleTimeChange}
                      className="flex-1"
                    />
                    <div className='flex w-full justify-between items-center text-xs md:textx-sm'>
                      <span className="text-gray-400">
                        {formatTime(currentTime)}
                      </span>
                      <span className="text-gray-400">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`hover:text-white ${isShuffle ? 'text-primary' : 'text-gray-400'}`}
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevious}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`hover:text-white ${isRepeat ? 'text-primary' : 'text-gray-400'}`}
                    >
                      <Repeat className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center gap-2 w-full md:min-w-[240px] justify-center md:justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => setIsLiked(!isLiked)}
                    onClick={() => { handleDownloadAudio(currentSong.audioUrl, currentSong.title) }}
                    className={`hover:text-white ${isLiked ? 'text-red-500/' : 'text-gray-400/'}`}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Song Information</DialogTitle>
                        <DialogDescription>
                          <div className="space-y-2">
                            <p><strong>Title:</strong> {currentSong.title}</p>
                            <p><strong>Genres:</strong> {currentSong.genres.join(', ')}</p>
                            <p><strong>Generated:</strong> {new Date(currentSong.timestamp).toLocaleString()}</p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => setIsMusicPlayerFullScreen(val => !val)}
                    onClick={minimizeScreen}
                    className={`hover:text-white 'text-gray-400' hidden md:flex`}
                  >
                    {!isMusicPlayerFullScreen ? <Maximize2 className="h-5 w-5" />
                      : <Minimize2 className="h-5 w-5" />}
                  </Button>

                </div>
              </div>

              :

              <div className="p-4 w-full relative">
                <div className="flex items-center justify-between gap-4 relative">
                  <div
                    onClick={() => {
                      if ((isMobileDevice() || isTouchDevice()) && !isMusicPlayerFullScreen) {
                        maximizeScreen()
                      }
                    }}
                    className='bg-red-400/ bg-transparent absolute size-full top-0 left-0 z-10 md:hidden' />
                  {/* Song Info */}
                  <div className="flex flex-1 md:flex-none items-center gap-4 md:min-w-[240px] z-0">
                    <img
                      src={currentSong.coverArt}
                      alt={currentSong.title}
                      className="size-8 sm:size-12 rounded"
                    />
                    <div>
                      <h3 className="font-medium">{currentSong.title}</h3>
                      <p className="text-sm text-gray-400">
                        {currentSong.genres.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="md:flex-1 z-20">
                    <div className="flex justify-center items-center gap-4 mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`hover:text-white hidden md:flex ${isShuffle ? 'text-primary' : 'text-gray-400'}`}
                      >
                        <Shuffle className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevious}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`hover:text-white hidden md:flex ${isRepeat ? 'text-primary' : 'text-gray-400'}`}
                      >
                        <Repeat className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        // onClick={() => setIsMusicPlayerFullScreen(val => !val)}
                        onClick={maximizeScreen}
                        className={`hover:text-white /text-gray-400 hidden`}
                      >
                        {!isMusicPlayerFullScreen ? <ChevronUp className="h-5 w-5" />
                          : <ChevronDown className="h-5 w-5" />}
                      </Button>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        onValueChange={handleTimeChange}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  {/* Additional Controls */}
                  <div className="hidden md:flex items-center gap-2 min-w-[240px] justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => setIsLiked(!isLiked)}
                      onClick={() => { handleDownloadAudio(currentSong.audioUrl, currentSong.title) }}
                      className={`hover:text-white ${isLiked ? 'text-red-500/' : 'text-gray-400/'}`}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Song Information</DialogTitle>
                          <DialogDescription>
                            <div className="space-y-2">
                              <p><strong>Title:</strong> {currentSong.title}</p>
                              <p><strong>Genres:</strong> {currentSong.genres.join(', ')}</p>
                              <p><strong>Generated:</strong> {new Date(currentSong.timestamp).toLocaleString()}</p>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => setIsMusicPlayerFullScreen(val => !val)}
                      onClick={maximizeScreen}
                      className={`hover:text-white 'text-gray-400'`}
                    >
                      {!isMusicPlayerFullScreen ? <Maximize2 className="h-5 w-5" />
                        : <Minimize2 className="h-5 w-5" />}
                    </Button>

                  </div>
                </div>
              </div>
            }

            {/* Hidden audio element */}
            <audio
              autoPlay={true}
              ref={audioRef}
              src={currentSong.audioUrl || ''}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
              }}
              onLoadedMetadata={() => {
                setDuration(audioRef.current?.duration || 0);
              }}
            />
          </div>
        )
      }
    </div>
  )
}
