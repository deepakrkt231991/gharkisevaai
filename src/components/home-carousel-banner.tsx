'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Banner } from '@/lib/entities';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Skeleton } from './ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type BannerData = {
    title: string;
    subtitle: string;
    imageUrl: string;
    link: string;
    imageHint: string;
};

// Default banners based on user request if Firestore is empty
const defaultBanners: BannerData[] = PlaceHolderImages
    .filter(p => p.type === 'banner')
    .map(p => ({
        title: p.title || '',
        subtitle: p.subtitle || '',
        imageUrl: p.imageUrl,
        link: p.link || '#',
        imageHint: p.imageHint,
    }));

export function HomeCarouselBanner() {
    const firestore = useFirestore();
    const autoplay = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    );
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [autoplay.current]);

    const bannersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'banners');
    }, [firestore]);

    const { data: firestoreBanners, isLoading } = useCollection<Banner>(bannersQuery);

    const bannersToDisplay = (firestoreBanners && firestoreBanners.length > 0)
        ? firestoreBanners.map(b => ({ ...b, imageHint: '' })) // Add empty imageHint for type consistency
        : defaultBanners;

    if (isLoading) {
        return <Skeleton className="h-[180px] w-full rounded-xl" />;
    }
    
    if (bannersToDisplay.length === 0) {
        return null;
    }

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {bannersToDisplay.map((banner, index) => (
                    <div className="flex-grow-0 flex-shrink-0 basis-full min-w-0" key={index}>
                        <Link href={banner.link} className="block p-1">
                            <Card className={cn("relative h-[180px] w-full overflow-hidden rounded-2xl group border-2 border-transparent hover:border-primary transition-all duration-300")}>
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={banner.imageHint}
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-center">
                                    <h2 className="text-2xl font-extrabold font-headline text-white drop-shadow-md">{banner.title}</h2>
                                    <p className="text-md text-white/90 font-medium drop-shadow-sm max-w-xs">{banner.subtitle}</p>
                                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-accent">
                                        <span>Explore Now</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
