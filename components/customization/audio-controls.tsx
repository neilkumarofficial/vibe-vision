"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAudioProcessor } from "@/hooks/use-audio-processor";
import { motion } from "framer-motion";

export function AudioControls() {
  const { settings, updateSettings } = useAudioProcessor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="backdrop-blur-lg bg-opacity-50 border-primary/20">
        <CardHeader>
          <CardTitle>Audio Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tempo</Label>
              <Slider
                value={[settings.tempo || 100]}
                max={200}
                min={50}
                step={1}
                onValueChange={([value]) =>
                  updateSettings({ tempo: value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Pitch</Label>
              <Slider
                value={[settings.pitch || 0]}
                max={12}
                min={-12}
                step={1}
                onValueChange={([value]) =>
                  updateSettings({ pitch: value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Lofi Room Size</Label>
              <Slider
                value={[
                  (settings.lofiEffect?.roomSize || 0.75) * 100
                ]}
                max={100}
                min={0}
                step={1}
                onValueChange={([value]) =>
                  updateSettings({ 
                    lofiEffect: { 
                      roomSize: value / 100 
                    } 
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Echo Delay (s)</Label>
              <Slider
                value={[settings.echoEffect?.delay || 0.25]}
                max={1}
                min={0.1}
                step={0.05}
                onValueChange={([value]) =>
                  updateSettings({ 
                    echoEffect: { 
                      delay: value 
                    } 
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}