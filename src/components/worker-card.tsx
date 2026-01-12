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
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
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
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-headline">{worker.name}</h3>
            <Badge variant="secondary">{worker.specialty}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
              <span>{worker.rating?.toFixed(1)}</span>
            </div>
            <span>({worker.reviews} समीक्षाएं)</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            5 किमी दूर
          </p>
          <Button className="mt-4 w-full">
            <Phone className="mr-2 h-4 w-4" />
            संपर्क करें
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
