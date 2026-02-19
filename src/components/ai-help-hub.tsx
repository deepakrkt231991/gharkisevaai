'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Wrench, Sofa, ShieldCheck, Video } from 'lucide-react';

const assistants = [
  {
    id: 'wall_repair',
    name: 'AI Defect Analyzer',
    description: 'Upload a photo of a wall crack or leak to get instant repair steps, cost estimates, and a redesign video.',
    icon: <Wrench className="h-8 w-8 text-primary" />,
    href: '/analyze'
  },
  {
    id: 'room_designer',
    name: 'AI Interior Designer',
    description: 'Get Vastu & aesthetic suggestions for your room. Generate a photorealistic 3D render of the new look.',
    icon: <Sofa className="h-8 w-8 text-primary" />,
    href: '/interior-analysis'
  },
  {
    id: 'property_verifier',
    name: 'AI Property Verifier',
    description: 'Upload property documents for AI-powered legal verification and generate a trust certificate.',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    href: '/legal-vault'
  },
  {
    id: 'video_ad_maker',
    name: 'AI Video Ad Maker',
    description: 'Create a short, professional video ad for your property or service with a simple text prompt.',
    icon: <Video className="h-8 w-8 text-primary" />,
    href: '/create-video'
  }
];

export function AiAssistanceHub() {
  return (
    <div className="space-y-4">
      {assistants.map((ai) => (
        <Link key={ai.id} href={ai.href} className="block group">
          <Card className="glass-card group-hover:border-primary transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                {ai.icon}
              </div>
              <div>
                <h3 className="font-bold font-headline text-white">{ai.name}</h3>
                <p className="text-sm text-muted-foreground">{ai.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
