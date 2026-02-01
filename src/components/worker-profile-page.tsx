

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Star, MessageSquare, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';

import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Worker } from '@/lib/entities';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import AdsenseBanner from './adsense-banner';

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" fill="currentColor"/></svg>
);

export function WorkerProfilePage({ workerId }: { workerId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const workerRef = useMemoFirebase(() => {
    if (!firestore || !workerId) return null;
    return doc(firestore, 'workers', workerId);
  }, [firestore, workerId]);

  const { data: worker, isLoading } = useDoc<Worker>(workerRef);

  const handleShare = async () => {
    if (!worker) return;
    const shareData = {
      title: `${worker.name} - Verified GrihSeva AI Professional`,
      text: `Check out ${worker.name}, a verified ${worker.skills?.join(', ')} professional on GrihSeva AI.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: 'Link Copied!', description: 'Worker profile link copied to clipboard.' });
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast({ title: 'Share Failed', description: 'Could not share the profile.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-background text-center p-4">
        <p className="text-lg font-semibold text-white">Worker not found</p>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const portfolioImages = worker.portfolioImageUrls && worker.portfolioImageUrls.length > 0
    ? worker.portfolioImageUrls
    : ['https://placehold.co/600x400?text=No+Portfolio'];
    
  const whatsAppMessage = `Hi ${worker.name}, I'm interested in your ${worker.skills?.join(', ')} services from Ghar Ki Seva.`;

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">Worker Profile</h1>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary">
                <AvatarImage src={`https://picsum.photos/seed/${worker.id}/150/150`} />
                <AvatarFallback>{worker.name?.charAt(0) || 'W'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-headline">{worker.name}</h2>
                <p className="font-semibold text-primary capitalize">{worker.skills?.join(', ')}</p>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-yellow-400 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold text-white">{worker.rating?.toFixed(1) || 'New'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{worker.successfulOrders || 0}+ Jobs Done</p>
                </div>
              </div>
            </div>
            {worker.isVerified && (
                <div className="mt-4 flex items-center gap-2 text-green-400 border border-green-500/30 bg-green-900/20 p-2 rounded-lg text-sm">
                    <ShieldCheck className="h-5 w-5"/>
                    <p className="font-semibold">AI Verified Professional</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card p-1">
          <AdsenseBanner adSlot="2001427785" />
        </Card>
        
        {portfolioImages.length > 0 && (
          <div>
            <h3 className="text-lg font-bold font-headline mb-3">Portfolio / Gallery</h3>
            <Carousel>
              <CarouselContent className="-ml-2">
                {portfolioImages.map((url, index) => (
                  <CarouselItem key={index} className="pl-2 basis-3/4">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`Portfolio image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
        
        <Card className="glass-card">
            <CardContent className="p-4">
                <h3 className="text-lg font-bold font-headline mb-3">Stats & Badges</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Response Time</p>
                        <p className="font-bold text-white">Under 15 mins</p>
                    </div>
                     <div className="bg-card p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Job Success</p>
                        <p className="font-bold text-white">98%</p>
                    </div>
                 </div>
            </CardContent>
        </Card>

      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent z-10">
        <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="outline" className="h-14 text-base bg-green-500/10 border-green-500/30 text-green-400 flex items-center gap-2">
                <a href={`https://wa.me/918291569096?text=${encodeURIComponent(whatsAppMessage)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> WhatsApp
                </a>
            </Button>
            <Button asChild variant="outline" className="h-14 text-base border-primary text-primary">
                <Link href={`/chat/job-temp-${workerId}`}>
                <MessageSquare /> Chat
                </Link>
            </Button>
            <Button asChild className="h-14 text-base bg-primary text-primary-foreground">
                <Link href="/book-service">
                <Calendar /> Book
                </Link>
            </Button>
        </div>
      </footer>
    </div>
  );
}
