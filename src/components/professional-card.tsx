'use client';

import Image from 'next/image';
import { Star, MessageSquare, Calendar, CheckCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ProfessionalCardProps {
  worker: ImagePlaceholder;
}

export function ProfessionalCard({ worker }: ProfessionalCardProps) {
  if (!worker.name || !worker.specialty) {
    return null;
  }

  return (
    <Card className="glass-card overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="relative h-16 w-16">
                    <Image
                        src={worker.imageUrl}
                        alt={worker.description}
                        fill
                        className="object-cover rounded-full"
                        data-ai-hint={worker.imageHint}
                        sizes="64px"
                    />
                    <div className="absolute bottom-0 right-0 bg-accent text-accent-foreground rounded-full p-0.5">
                        <CheckCircle className="h-4 w-4" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold font-headline text-white">{worker.name}</h3>
                    <p className="text-sm text-muted-foreground">{worker.specialty} • {worker.experience}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold text-white">{worker.rating?.toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">({worker.reviews} reviews)</span>
                    </div>
                </div>
          </div>
          <div className="text-right">
              <p className="text-xs text-muted-foreground">STARTING FROM</p>
              <p className="text-2xl font-bold font-headline text-white">₹{worker.startingPrice}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <Button className="w-full bg-primary text-primary-foreground h-12">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent border-border h-12 w-12 flex-shrink-0">
                <MessageSquare className="h-6 w-6"/>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
