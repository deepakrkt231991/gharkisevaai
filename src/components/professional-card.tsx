
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { Worker } from '@/lib/entities';


interface ProfessionalCardProps {
  worker: ImagePlaceholder | (Worker & { id: string });
}

export function ProfessionalCard({ worker }: ProfessionalCardProps) {
  // Data normalization
  const id = worker.id;
  const name = worker.name || 'Verified Worker';
  const specialty = (worker as any).specialty || (worker as Worker).skills?.[0] || 'Professional';
  const experience = (worker as any).experience || `${(worker as Worker).successfulOrders || 0}+ jobs`;
  const rating = worker.rating?.toFixed(1) || 'New';
  const reviews = (worker as any).reviews || (worker as Worker).successfulOrders || 0;
  const startingPrice = (worker as any).startingPrice || 199; // Default price
  const imageUrl = (worker as any).imageUrl || `https://picsum.photos/seed/${worker.id}/150/150`;
  const phone = (worker as any).phone;


  return (
    <Card className="overflow-hidden bg-card/80 glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
              <div className="absolute bottom-0 right-0 rounded-full border-2 border-card bg-yellow-400 p-0.5 text-black">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-sm text-muted-foreground">{specialty} • {experience}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-white">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">FROM</p>
            <p className="text-xl font-bold text-white">₹{startingPrice}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild className="w-full bg-primary text-primary-foreground">
            <Link href={`/worker/${id}`}>
              <Calendar className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
          <Button asChild variant="secondary" size="icon" className="h-10 w-10 flex-shrink-0 bg-card hover:bg-card/70">
            <Link href={`/chat/job-temp-${id}`}>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
