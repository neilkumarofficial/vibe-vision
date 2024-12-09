"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextProviderProps {
  children: React.ReactNode;
}

interface AudioContextType {
  audioContext: AudioContext | null;
}

const AudioContext = createContext<AudioContextType>({ audioContext: null });

export function AudioContextProvider({ children }: AudioContextProviderProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);

    return () => {
      context.close();
    };
  }, []);

  return (
    <AudioContext.Provider value={{ audioContext }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  return useContext(AudioContext);
}