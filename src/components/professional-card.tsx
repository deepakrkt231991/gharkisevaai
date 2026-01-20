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
    <Card className="overflow-hidden bg-card/80 glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={worker.imageUrl}
                alt={worker.description}
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
              <div className="absolute bottom-0 right-0 rounded-full border-2 border-card bg-yellow-400 p-0.5 text-black">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{worker.name}</h3>
              <p className="text-sm text-muted-foreground">{worker.specialty} • {worker.experience}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-white">{worker.rating?.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({worker.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">STARTING FROM</p>
            <p className="text-xl font-bold text-white">₹{worker.startingPrice}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild className="w-full bg-primary text-primary-foreground">
            <Link href="/book-service">
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Link>
          </Button>
          <Button asChild variant="secondary" size="icon" className="h-10 w-10 flex-shrink-0 bg-card hover:bg-card/70">
            <Link href={`/chat/job-temp-${worker.id}`}>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
