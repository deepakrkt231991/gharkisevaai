'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Calendar, CheckCircle, MapPin, Briefcase, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Worker } from '@/lib/entities';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface ProfessionalCardProps {
  worker: Worker & { id: string };
  distance?: number | null;
}

export function ProfessionalCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card/80 glass-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-full" />
        <div className="flex gap-2 h-14">
            <Skeleton className="w-14 h-14 rounded-md" />
            <Skeleton className="w-14 h-14 rounded-md" />
            <Skeleton className="w-14 h-14 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Star Rating Component as requested by user
const StarRating = ({ rating, totalReviews }: { rating: number, totalReviews: number }) => {
  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={cn("h-4 w-4", i < Math.round(rating) ? 'fill-current' : 'fill-transparent stroke-current')} />
        ))}
      </div>
      <span className="text-white/80 text-xs font-medium">
        {rating.toFixed(1)} ({totalReviews}+ Reviews)
      </span>
    </div>
  );
};


export function ProfessionalCard({ worker, distance }: ProfessionalCardProps) {
  const {
    id,
    name = 'Verified Worker',
    skills = [],
    successfulOrders = 0,
    rating = 0,
    isVerified = false,
    portfolioImageUrls = []
  } = worker;

  const isTopRated = rating >= 4.5;
  const specialty = skills[0] || 'Professional';

  return (
    <Card className="overflow-hidden bg-card/80 glass-card">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative h-14 w-14 flex-shrink-0">
            <Image
              src={`https://picsum.photos/seed/${id}/150/150`}
              alt={name}
              fill
              className="rounded-full object-cover"
              sizes="56px"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{name}</h3>
              {isVerified && <CheckCircle className="h-4 w-4 text-blue-400 fill-current" />}
            </div>
             <p className="text-sm text-muted-foreground capitalize">{specialty}</p>
          </div>
          <Button asChild variant="secondary" size="icon" className="h-9 w-9 flex-shrink-0 bg-card/50 hover:bg-card/70">
            <Link href={`/chat/job-temp-${id}`}>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
        </div>

        {/* Badges and Stats */}
        <div className='space-y-3'>
            <div className="flex flex-wrap gap-2 items-center">
                {isTopRated && <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/40"><Award className="mr-1.5"/>Top Rated</Badge>}
                <Badge variant="outline" className="text-white/70"><Briefcase className="mr-1.5"/>{successfulOrders}+ Jobs Completed</Badge>
                {distance !== null && distance !== undefined && (
                   <Badge variant="outline" className="text-primary/90 border-primary/50"><MapPin className="mr-1.5"/>{distance.toFixed(1)} km away</Badge>
                )}
            </div>
            <StarRating rating={rating} totalReviews={successfulOrders} />
        </div>

        {/* Portfolio Preview */}
        {portfolioImageUrls && portfolioImageUrls.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Work</p>
                <div className="flex gap-2">
                    {portfolioImageUrls.slice(0, 4).map((url, index) => (
                        <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden">
                             <Image src={url} alt={`Work sample ${index + 1}`} fill className="object-cover"/>
                        </div>
                    ))}
                    {portfolioImageUrls.length > 4 && (
                        <div className="h-16 w-16 rounded-md bg-card flex items-center justify-center text-xs font-bold text-primary">
                           +{portfolioImageUrls.length - 4}
                        </div>
                    )}
                </div>
            </div>
        )}
        
        {/* Action Button */}
        <Button asChild className="w-full bg-primary text-primary-foreground h-12 text-base">
          <Link href={`/worker/${id}`}>
            <Calendar className="mr-2 h-4 w-4" />
            View Profile & Book
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
