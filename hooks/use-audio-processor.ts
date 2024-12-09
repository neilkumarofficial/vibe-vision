"use client";

import { useState } from "react";
import { AudioProcessingOptions, processAudio } from "@/lib/audio-processor";
import { useAudioContext } from "./use-audio-context";
import { PRESETS } from "@/lib/constants/presets";

export function useAudioProcessor() {
  const { audioContext } = useAudioContext();
  const [currentPreset, setCurrentPreset] = useState<string>("");
  const [settings, setSettings] = useState<AudioProcessingOptions>({
    tempo: 100,
    pitch: 0,
    vinylCrackle: 0,
    tapeWarble: 0,
    ambientSounds: {
      rain: false,
      coffeeShop: false,
      forest: false
    },
    lofiEffect: {
      roomSize: 0.75,
      damping: 0.5,
      wetLevel: 0.08,
      dryLevel: 0.2,
      delay: 2,
      slowFactor: 0.08
    },
    // Add default echo effect options
    echoEffect: {
      delay: 0.25,     // 250ms between echoes
      decay: 0.5,      // 50% volume reduction per echo
      feedback: 0.3,   // 30% feedback
      maxEchoes: 5     // Maximum 5 echo repetitions
    }
  });

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setSettings(preset.settings);
    }
  };

  const updateSettings = (newSettings: Partial<AudioProcessingOptions>) => {
    setSettings(prev => {
      // Handle nested objects carefully
      const updatedSettings = {
        ...prev,
        ...newSettings
      };

      // Ensure ambientSounds is properly merged
      if (newSettings.ambientSounds) {
        updatedSettings.ambientSounds = {
          ...prev.ambientSounds,
          ...newSettings.ambientSounds
        };
      }

      // Ensure lofiEffect is properly merged
      if (newSettings.lofiEffect) {
        updatedSettings.lofiEffect = {
          ...prev.lofiEffect,
          ...newSettings.lofiEffect
        };
      }

      return updatedSettings;
    });
  };

  const processTrack = async (file: File) => {
    if (!audioContext) return null;
    
    try {
      const source = await processAudio(audioContext, file, settings);
      return source;
    } catch (error) {
      console.error('Error processing audio:', error);
      return null;
    }
  };

  return {
    settings,
    currentPreset,
    updateSettings,
    applyPreset,
    processTrack
  };
}