'use client';

import { Card } from '@/components/ui/card';
import { ScriptAnalysis } from '@/types/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ScriptAnalyticsProps {
  analysis: ScriptAnalysis;
}

export function ScriptAnalytics({ analysis }: ScriptAnalyticsProps) {
  const data = [
    { name: 'Pacing', value: analysis.pacing },
    { name: 'Comedy Density', value: analysis.comedyDensity },
    { name: 'Audience Engagement', value: analysis.audienceEngagement },
    { name: 'Character Development', value: analysis.characterDevelopment },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Script Analytics</h3>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Suggestions for Improvement</h4>
        <ul className="list-disc pl-4 space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}