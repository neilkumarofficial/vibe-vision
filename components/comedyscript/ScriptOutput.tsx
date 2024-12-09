'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Copy, Check } from 'lucide-react';
import { generatePDF, downloadPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';

interface ScriptOutputProps {
  script: string;
}

export function ScriptOutput({ script }: ScriptOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Script copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy script',
        variant: 'destructive',
      });
    }
  };

  const downloadScript = async (format: 'pdf' | 'doc') => {
    setIsDownloading(true);
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
      toast({
        title: 'Downloaded!',
        description: `Script downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download script',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Generated Script</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadScript('pdf')}
            disabled={isDownloading || !script}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadScript('doc')}
            disabled={isDownloading || !script}
          >
            <FileText className="h-4 w-4 mr-2" />
            DOC
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!script}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="min-h-[400px] max-h-[500px] overflow-y-auto bg-muted p-4 rounded-md">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {script || 'Your generated script will appear here...'}
        </pre>
      </div>
    </Card>
  );
}