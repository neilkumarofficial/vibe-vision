'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, FileText, Paperclip } from 'lucide-react';
import { ScriptForm } from '@/components/comedyscript/ScriptForm';
import { ScriptOutput } from '@/components/comedyscript/ScriptOutput';
import { Settings } from '@/components/comedyscript/Settings';
import MyGenerations from '@/components/comedyscript/my-generations';
import { generateScript } from '@/lib/api';
import { ScriptFormData, ScriptSettings } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

// Mock data for generations (replace with actual data fetching)
const mockGenerations = [
  {
    id: '1',
    title: 'Standup Comedy Script 1',
    contentType: 'comedy-script',
    createdAt: new Date('2024-02-15'),
    content: 'This is the content of the first comedy script...'
  },
  {
    id: '2',
    title: 'Sketch Comedy Script 2',
    contentType: 'comedy-script',
    createdAt: new Date('2024-11-20'),
    content: 'This is the content of the second comedy script...'
  }
];

export function ComedyScriptGenerator() {
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<ScriptSettings>({
    tone: 'balanced',
    voice: 'natural',
    language: 'en',
    creativityLevel: 50,
    useAICharacters: true,
    enableSceneAnalysis: true,
    collaborativeMode: false,
  });

  const handleGenerate = async (formData: ScriptFormData) => {
    setIsGenerating(true);
    try {
      const script = await generateScript({ formData, settings });
      setGeneratedScript(script);
      // Add the new generation to mockGenerations
      mockGenerations.unshift({
        id: `${mockGenerations.length + 1}`,
        title: `${formData.comedyType.charAt(0).toUpperCase() + formData.comedyType.slice(1)} Comedy Script`,
        contentType: 'comedy-script',
        createdAt: new Date(),
        content: script
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate script. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsChange = (newSettings: ScriptSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="container mx-auto max-w-7xl relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Comedy Script Generator</h1>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Script Generation Settings</DialogTitle>
            </DialogHeader>
            <Settings 
              settings={settings} 
              onSettingsChange={handleSettingsChange} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex grid gap-6">
        <div className="flex grid grid-cols-2 lg:grid-cols-2 gap-6">
          <ScriptForm 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating}
          />
          <ScriptOutput script={generatedScript} />
        </div>
        <div className="space-y-6">
          <MyGenerations 
            data={mockGenerations.filter(item => item.contentType === "comedy-script")} 
          />
        </div>
      </div>
    </div>
  );
}