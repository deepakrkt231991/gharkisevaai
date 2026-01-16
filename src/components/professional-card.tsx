'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Calendar, CheckCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ProfessionalCardProps {
  worker: ImagePlaceholder;
}

export function ProfessionalCard({ worker }: ProfessionalCardProps) {
  if (!worker.name || !worker.specialty) {
    return null;
  }

  return (
    <Card className="glass-card overflow-hidden transition-shadow duration-300 hover:shadow-lg bg-card/80">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                        src={worker.imageUrl}
                        alt={worker.description}
                        fill
                        className="object-cover rounded-full"
                        data-ai-hint={worker.imageHint}
                        sizes="64px"
                    />
                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-black rounded-full p-0.5 border-2 border-card">
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
          <div className="text-right flex-shrink-0">
              <p className="text-xs text-muted-foreground">STARTING FROM</p>
              <p className="text-2xl font-bold font-headline text-white">₹{worker.startingPrice}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <Button asChild className="w-full bg-primary text-primary-foreground h-12">
                 <Link href="/book-service">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Now
                </Link>
            </Button>
            <Button variant="secondary" size="icon" className="bg-card hover:bg-card/80 h-12 w-12 flex-shrink-0 rounded-full">
                <MessageSquare className="h-6 w-6 text-muted-foreground"/>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
