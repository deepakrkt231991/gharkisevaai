"use client";

import Image from 'next/image';
import { Star, Phone } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface WorkerCardProps {
  worker: ImagePlaceholder;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  if (!worker.name || !worker.specialty) {
    return null;
  }

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-card">
      <CardContent className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={worker.imageUrl}
            alt={worker.description}
            fill
            className="object-cover"
            data-ai-hint={worker.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold font-headline">{worker.name}</h3>
            <Badge variant="secondary" className="flex-shrink-0">{worker.specialty}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span>{worker.rating?.toFixed(1)}</span>
            </div>
            <span>({worker.reviews} समीक्षाएं)</span>
          </div>
          <p className="text-sm text-muted-foreground">
            5 किमी दूर
          </p>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Phone className="mr-2 h-4 w-4" />
            संपर्क करें
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
