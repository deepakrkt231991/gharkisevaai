'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Calendar, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Worker } from '@/lib/entities';
import { Skeleton } from './ui/skeleton';

interface ProfessionalCardProps {
  worker: Worker & { id: string };
  distance?: number | null;
}

export function ProfessionalCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card/80 glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-3 w-10 ml-auto" />
            <Skeleton className="h-6 w-16 ml-auto" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfessionalCard({ worker, distance }: ProfessionalCardProps) {
  const id = worker.id;
  const name = worker.name || 'Verified Worker';
  const specialty = worker.skills?.[0] || 'Professional';
  const experience = `${worker.successfulOrders || 0}+ jobs`;
  const rating = worker.rating?.toFixed(1) || 'New';
  const reviews = worker.successfulOrders || 0;
  const startingPrice = (worker as any).startingPrice || 199;
  const imageUrl = (worker as any).imageUrl || `https://picsum.photos/seed/${worker.id}/150/150`;

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
                loading="lazy"
              />
              {worker.isVerified && (
                <div className="absolute bottom-0 right-0 rounded-full border-2 border-card bg-green-400 p-0.5 text-black">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{specialty} • {experience}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-white">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
              </div>
              {distance !== null && distance !== undefined && (
                <p className="text-xs text-primary font-bold flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {distance.toFixed(1)} km away
                </p>
              )}
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
