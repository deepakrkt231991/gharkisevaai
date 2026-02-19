'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useGeolocation } from '@/hooks/use-geolocation';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import type { Property, Product, Worker } from '@/lib/entities';
import { calculateDistance } from '@/lib/geo-helpers';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { PropertyCard } from './property-card';
import { ProductCard } from './product-card';
import { ProfessionalCard } from './professional-card';
import { Skeleton } from './ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from './ui/button';
import React from 'react';

const DISTANCE_KM = 20;

const LiveFeedSection = ({ title, link, items, renderItem, isLoading }: { title: string; link: string; items: any[]; renderItem: (item: any) => React.ReactNode; isLoading: boolean; }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline text-white">{title}</h3>
                <div className="flex items-center gap-2">
                     {items.length > 2 && (
                        <div className="flex items-center gap-1">
                            <Button onClick={scrollPrev} variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={prevBtnDisabled}>
                                <ArrowLeft size={16} />
                            </Button>
                            <Button onClick={scrollNext} variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={nextBtnDisabled}>
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    )}
                    {items.length > 0 && (
                        <Link href={link} className="text-sm font-bold text-primary flex items-center gap-1">
                            VIEW ALL
                        </Link>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="flex gap-4 overflow-hidden -mx-4 px-4">
                    <div className="flex-shrink-0 w-80 pr-4"><Skeleton className="h-80 w-full" /></div>
                    <div className="flex-shrink-0 w-80 pr-4"><Skeleton className="h-80 w-full" /></div>
                </div>
            ) : items.length > 0 ? (
                <div className="overflow-hidden -mx-4" ref={emblaRef}>
                    <div className="flex px-4">
                        {items.map((item) => renderItem(item))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-muted-foreground text-sm py-8">No items to show.</div>
            )}
        </div>
    );
};


export function LiveFeed() {
    const firestore = useFirestore();
    const { latitude: userLat, longitude: userLon, isLoading: isGeoLoading } = useGeolocation();

    // --- Data Fetching ---
    const salePropertiesQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'properties'), where('listingType', '==', 'sale'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
    const rentPropertiesQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'properties'), where('listingType', '==', 'rent'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
    const productsQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'products'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
    const workersQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'workers'), where('isVerified', '==', true), limit(10)), [firestore]);

    const { data: allSaleProperties, isLoading: isSaleLoading } = useCollection<Property>(salePropertiesQuery);
    const { data: allRentProperties, isLoading: isRentLoading } = useCollection<Property>(rentPropertiesQuery);
    const { data: allProducts, isLoading: isProductsLoading } = useCollection<Product>(productsQuery);
    const { data: allWorkers, isLoading: isWorkersLoading } = useCollection<Worker>(workersQuery);

    // --- Merging with Demo Data ---
    const salePropertiesWithDemo = useMemo(() => {
        const demoProps = PlaceHolderImages
            .filter(p => p.type === 'property' && p.listingType === 'sale')
            .map(p => ({
                id: p.id,
                propertyId: p.id,
                ownerId: 'demo-user-' + p.id,
                title: p.title || 'Demo Property',
                location: p.location || 'Demo Location',
                price: p.price,
                priceUnit: p.priceUnit,
                sqft: p.sqft || 1000,
                parking: p.parking || 1,
                imageUrl: p.imageUrl,
                listingType: 'sale',
                verificationStatus: 'verified',
                isAiVerified: p.isAiVerified
            } as Property & { id: string }));
        
        const realPropIds = new Set(allSaleProperties?.map(p => p.id));
        const uniqueDemoProps = demoProps.filter(p => !realPropIds.has(p.id));
        
        return [...(allSaleProperties || []), ...uniqueDemoProps];
    }, [allSaleProperties]);

    const rentPropertiesWithDemo = useMemo(() => {
        const demoProps = PlaceHolderImages
            .filter(p => p.type === 'property' && p.listingType === 'rent')
            .map(p => ({
                id: p.id,
                propertyId: p.id,
                ownerId: 'demo-user-' + p.id,
                title: p.title || 'Demo Property',
                location: p.location || 'Demo Location',
                rentAmount: p.price ? p.price * 100000 : 25000,
                sqft: p.sqft || 1000,
                parking: p.parking || 1,
                imageUrl: p.imageUrl,
                listingType: 'rent',
                verificationStatus: 'verified',
                isAiVerified: p.isAiVerified
            } as Property & { id: string }));
        
        const realPropIds = new Set(allRentProperties?.map(p => p.id));
        const uniqueDemoProps = demoProps.filter(p => !realPropIds.has(p.id));

        return [...(allRentProperties || []), ...uniqueDemoProps];
    }, [allRentProperties]);
    
    const productsWithDemo = useMemo(() => {
        const demoProducts = PlaceHolderImages
            .filter(p => p.type === 'product')
            .map(p => ({
                id: p.id,
                productId: p.id,
                ownerId: 'demo-user-' + p.id,
                name: p.name || 'Demo Item',
                category: p.category,
                price: p.price || 0,
                description: 'This is a demo item.',
                location: p.location || 'Unknown Location',
                imageUrls: p.imageUrl ? [p.imageUrl] : [],
                isReserved: !!p.isReserved,
            } as Product & { id: string }));

        const realProductIds = new Set(allProducts?.map(p => p.id));
        const uniqueDemoProducts = demoProducts.filter(p => !realProductIds.has(p.id));

        return [...(allProducts || []), ...uniqueDemoProducts];
    }, [allProducts]);

    // --- Filtering and Fallback Logic ---
    const getFilteredAndSortedItems = <T extends { geo?: { latitude?: number; longitude?: number; } }>(items: (T & {id: string})[] | null) => {
        if (!items || isGeoLoading) return { displayItems: items || [], isNearby: false };
        if (!userLat || !userLon) return { displayItems: items, isNearby: false };

        const nearby = items.filter(item => {
            const loc = item.geo;
            if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
                const dist = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);
                return dist <= DISTANCE_KM;
            }
            return false;
        });

        if (nearby.length > 0) {
            return { displayItems: nearby, isNearby: true };
        }
        
        return { displayItems: items, isNearby: false }; // Fallback to global
    };
    
    // --- Merging and Filtering Data ---
    const { displayItems: salePropertiesToShow, isNearby: salePropertiesAreNearby } = useMemo(() => getFilteredAndSortedItems(salePropertiesWithDemo), [salePropertiesWithDemo, userLat, userLon, isGeoLoading]);
    const { displayItems: rentPropertiesToShow, isNearby: rentPropertiesAreNearby } = useMemo(() => getFilteredAndSortedItems(rentPropertiesWithDemo), [rentPropertiesWithDemo, userLat, userLon, isGeoLoading]);
    const { displayItems: productsToShow, isNearby: productsAreNearby } = useMemo(() => getFilteredAndSortedItems(productsWithDemo as any), [productsWithDemo, userLat, userLon, isGeoLoading]);
    const { displayItems: workersToShow, isNearby: workersAreNearby } = useMemo(() => getFilteredAndSortedItems(allWorkers), [allWorkers, userLat, userLon, isGeoLoading]);
    
    return (
        <div className="space-y-8">
            <LiveFeedSection 
                title={salePropertiesAreNearby ? "Homes for Sale Near You" : "Latest Homes for Sale"} 
                link="/explore?tab=buy" 
                isLoading={isSaleLoading || isGeoLoading} 
                items={salePropertiesToShow}
                renderItem={(prop) => (
                    <div key={prop.id} className="flex-shrink-0 w-80 pr-4">
                        <PropertyCard property={prop as any} />
                    </div>
                )}
            />

            <LiveFeedSection 
                title={rentPropertiesAreNearby ? "Homes for Rent Near You" : "Latest Homes for Rent"} 
                link="/explore?tab=rent" 
                isLoading={isRentLoading || isGeoLoading} 
                items={rentPropertiesToShow}
                renderItem={(prop) => (
                    <div key={prop.id} className="flex-shrink-0 w-80 pr-4">
                        <PropertyCard property={prop as any} />
                    </div>
                )}
            />

            <LiveFeedSection 
                title={productsAreNearby ? "Products Near You" : "Latest Products"} 
                link="/marketplace" 
                isLoading={isProductsLoading || isGeoLoading} 
                items={productsToShow}
                renderItem={(prod) => (
                     <div key={prod.id} className="flex-shrink-0 w-56 pr-4">
                        <ProductCard product={prod as any} />
                    </div>
                )}
            />
             
            <LiveFeedSection 
                title={workersAreNearby ? "Workers Near You" : "Top Workers"} 
                link="/find-a-worker" 
                isLoading={isWorkersLoading || isGeoLoading} 
                items={workersToShow}
                renderItem={(worker) => (
                    <div key={worker.id} className="flex-shrink-0 w-80 pr-4">
                       <ProfessionalCard worker={worker as any} />
                    </div>
                )}
            />
        </div>
    );
}
