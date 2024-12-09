'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScriptSettings } from '@/types/types';

interface SettingsProps {
  settings: ScriptSettings;
  onSettingsChange: (settings: ScriptSettings) => void;
}

export function Settings({ settings, onSettingsChange }: SettingsProps) {
  const handleChange = (key: keyof ScriptSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label>Tone Setting</Label>
          <Select
            value={settings.tone}
            onValueChange={(value) => handleChange('tone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funny">Funny</SelectItem>
              <SelectItem value="sarcastic">Sarcastic</SelectItem>
              <SelectItem value="witty">Witty</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Voice Setting</Label>
          <Select
            value={settings.voice}
            onValueChange={(value) => handleChange('voice', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => handleChange('language', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Creativity Level</Label>
          <Slider
            value={[settings.creativityLevel]}
            onValueChange={([value]) => handleChange('creativityLevel', value)}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground text-right">
            {settings.creativityLevel}%
          </p>
        </div>
      </div>
    </Card>
  );
}