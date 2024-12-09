"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PRESETS } from "@/lib/constants/presets";
import { useAudioProcessor } from "@/hooks/use-audio-processor";
import { motion } from "framer-motion";

export function PresetSelector() {
  const { currentPreset, applyPreset } = useAudioProcessor();

  useEffect(() => {
    // Apply default preset if none selected
    if (!currentPreset && PRESETS.length > 0) {
      applyPreset(PRESETS[0].id);
    }
  }, [currentPreset, applyPreset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="backdrop-blur-lg bg-opacity-50 border-primary/20">
        <CardHeader>
          <CardTitle>Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentPreset} onValueChange={applyPreset}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </motion.div>
  );
}