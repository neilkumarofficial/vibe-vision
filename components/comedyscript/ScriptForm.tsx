'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScriptFormData, ComedyType, TargetAudience} from '@/types/types';
import { Paperclip } from 'lucide-react';

const comedyTypes: { 
  type: ComedyType; 
  color: string; 
}[] = [
  { type: 'standup', color: 'bg-red-500' },
  { type: 'sketch', color: 'bg-blue-500' },
  { type: 'roast', color: 'bg-green-500' },
  { type: 'musical', color: 'bg-purple-500' },
  { type: 'improv', color: 'bg-yellow-500' },
  { type: 'sitcom', color: 'bg-pink-500' },
];

const audiences: { 
  type: TargetAudience; 
  color: string; 
}[] = [
  { type: 'everyone', color: 'bg-teal-500' },
  { type: 'kids', color: 'bg-orange-500' },
  { type: 'teens', color: 'bg-indigo-500' },
  { type: 'adults', color: 'bg-emerald-500' },
  { type: 'seniors', color: 'bg-rose-500' },
  { type: 'corporate', color: 'bg-cyan-500' },
  { type: 'family', color: 'bg-lime-500' },
];

interface ScriptFormProps {
  onGenerate: (data: ScriptFormData) => void;
  isGenerating: boolean;
}

export function ScriptForm({ 
  onGenerate, 
  isGenerating 
}: ScriptFormProps) {
  const [formData, setFormData] = useState<ScriptFormData>({
    comedyType: 'standup',
    targetAudience: 'everyone',
    duration: '1',
    context: '',
    image: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleDurationChange = (value: string) => {
    setFormData({ ...formData, duration: value });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Comedy Type Buttons */}
          <div>
            <Label className="mb-2 block">Comedy Type</Label>
            <div className="flex flex-wrap gap-2">
              {comedyTypes.map(({ type, color }) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.comedyType === type ? 'default' : 'outline'}
                  className={`
                    ${formData.comedyType === type 
                      ? `${color} text-white` 
                      : `border-2 ${color} bg-transparent text-${color.replace('bg-', '')}-500 hover:bg-transparent`
                    }
                  `}
                  onClick={() => setFormData({ ...formData, comedyType: type })}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Target Audience Buttons */}
          <div>
            <Label className="mb-2 block">Target Audience</Label>
            <div className="flex flex-wrap gap-2">
              {audiences.map(({ type, color }) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.targetAudience === type ? 'default' : 'outline'}
                  className={`
                    ${formData.targetAudience === type 
                      ? `${color} text-white` 
                      : `border-2 ${color} bg-transparent text-${color.replace('bg-', '')}-500 hover:bg-transparent`
                    }
                  `}
                  onClick={() => setFormData({ ...formData, targetAudience: type })}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration with Progress Bar */}
          <div>
            <Label className="mb-2 block">Duration (minutes)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <Input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  className="flex-grow p-0"
                />
                <span className="w-16 text-right">
                  {formData.duration} min
                </span>
              </div>
            </div>
          </div>

          {/* Additional Context with Image Upload */}
          <div>
            <Label htmlFor="context">Additional Context</Label>
            <div className="relative">
              <Textarea
                id="context"
                placeholder="Enter any additional context or requirements..."
                className="h-32 pr-10"
                value={formData.context}
                onChange={(e) =>
                  setFormData({ ...formData, context: e.target.value })
                }
              />
              <div className="absolute bottom-2 right-2">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="image" className="cursor-pointer">
                  <Paperclip className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Label>
              </div>
            </div>
            {formData.image && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.image.name}
              </p>
            )}
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={45} />
            <p className="text-sm text-muted-foreground text-center">
              Generating your comedy script...
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Script'}
        </Button>
      </form>
    </Card>
  );
}