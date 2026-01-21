'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useGeolocation } from '@/hooks/use-geolocation';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import type { Property, Product, Worker } from '@/lib/entities';
import { calculateDistance } from '@/lib/geo-helpers';

import { PropertyCard } from './property-card';
import { ProductCard } from './product-card';
import { ProfessionalCard } from './professional-card';
import { Skeleton } from './ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DISTANCE_KM = 10;

const LiveFeedSection = ({ title, link, children, isLoading, count }: { title: string; link: string; children: React.ReactNode; isLoading: boolean; count: number }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-headline text-white">{title}</h3>
            {count > 0 && (
                <Link href={link} className="text-sm font-bold text-primary flex items-center gap-1">
                    VIEW ALL <ArrowRight size={16} />
                </Link>
            )}
        </div>
        {isLoading ? (
            <div className="flex gap-4 overflow-hidden -mx-4 px-4">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-56 w-72 rounded-xl" />)}
            </div>
        ) : count > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                {children}
            </div>
        ) : (
            <div className="text-center text-muted-foreground text-sm py-8">No items to show.</div>
        )}
    </div>
);

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

    // --- Filtering and Fallback Logic ---
    const getFilteredAndSortedItems = <T extends { geo?: { latitude: number; longitude: number; } } | { location?: any }>(items: (T & {id: string})[] | null) => {
        if (!items || isGeoLoading) return { displayItems: items || [], isNearby: false };
        if (!userLat || !userLon) return { displayItems: items, isNearby: false };

        const nearby = items.filter(item => {
            const loc = (item as any).geo || (item as any).location;
            if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
                return false; // Cannot determine distance for this item
            }
            const dist = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);
            return dist <= DISTANCE_KM;
        });

        if (nearby.length > 0) {
            return { displayItems: nearby, isNearby: true };
        }
        
        return { displayItems: items, isNearby: false }; // Fallback to global
    };
    
    // --- Merging and Filtering Data ---
    const { displayItems: salePropertiesToShow, isNearby: salePropertiesAreNearby } = useMemo(() => {
        const demoData = PlaceHolderImages.filter(p => p.type === 'property' && p.listingType === 'sale').map(p => ({
             ...p,
             id: p.id,
             propertyId: p.id,
             ownerId: `demo-user-${p.id}`,
             listingType: 'sale' as const,
             geo: { latitude: 0, longitude: 0 },
             createdAt: null,
        }));
        const realIds = new Set(allSaleProperties?.map(p => p.id));
        const uniqueDemos = demoData.filter(p => !realIds.has(p.id));
        const combined = [...(allSaleProperties || []), ...uniqueDemos];
        return getFilteredAndSortedItems(combined as any);
    }, [allSaleProperties, userLat, userLon, isGeoLoading]);

    const { displayItems: rentPropertiesToShow, isNearby: rentPropertiesAreNearby } = useMemo(() => {
        const demoData = PlaceHolderImages.filter(p => p.type === 'property' && p.listingType === 'rent').map(p => ({
             ...p,
             id: p.id,
             propertyId: p.id,
             ownerId: `demo-user-${p.id}`,
             listingType: 'rent' as const,
             geo: { latitude: 0, longitude: 0 },
             createdAt: null,
        }));
        const realIds = new Set(allRentProperties?.map(p => p.id));
        const uniqueDemos = demoData.filter(p => !realIds.has(p.id));
        const combined = [...(allRentProperties || []), ...uniqueDemos];
        return getFilteredAndSortedItems(combined as any);
    }, [allRentProperties, userLat, userLon, isGeoLoading]);


    const { displayItems: productsToShow, isNearby: productsAreNearby } = useMemo(() => {
        const demoData = PlaceHolderImages.filter(p => p.type === 'product').map(p => ({
             ...p,
             id: p.id,
             productId: p.id,
             ownerId: 'demo-user-' + p.id,
             imageUrls: p.imageUrl ? [p.imageUrl] : [],
             createdAt: null,
        }));
        const realIds = new Set(allProducts?.map(p => p.id));
        const uniqueDemos = demoData.filter(p => !realIds.has(p.id));
        const combined = [...(allProducts || []), ...uniqueDemos];
        return getFilteredAndSortedItems(combined as any);
    }, [allProducts, userLat, userLon, isGeoLoading]);

    const { displayItems: workersToShow, isNearby: workersAreNearby } = useMemo(() => {
        const demoData = PlaceHolderImages.filter(p => p.type === 'worker').map(p => ({
            ...p,
            id: p.id,
            location: { latitude: 0, longitude: 0 }, // Add placeholder location
            createdAt: null,
        }));
        const realIds = new Set(allWorkers?.map(w => w.id));
        const uniqueDemos = demoData.filter(p => !realIds.has(p.id));
        const combined = [...(allWorkers || []), ...uniqueDemos];
        return getFilteredAndSortedItems(combined as any);
    }, [allWorkers, userLat, userLon, isGeoLoading]);
    
    return (
        <div className="space-y-8">
            <LiveFeedSection title={salePropertiesAreNearby ? "Homes for Sale Near You" : "Latest Homes for Sale"} link="/explore?tab=buy" isLoading={isSaleLoading} count={salePropertiesToShow.length}>
                {salePropertiesToShow.map(prop => (
                    <div key={prop.id} className="w-80 flex-shrink-0">
                        <PropertyCard property={prop as any} />
                    </div>
                ))}
            </LiveFeedSection>

            <LiveFeedSection title={rentPropertiesAreNearby ? "Homes for Rent Near You" : "Latest Homes for Rent"} link="/explore?tab=rent" isLoading={isRentLoading} count={rentPropertiesToShow.length}>
                {rentPropertiesToShow.map(prop => (
                    <div key={prop.id} className="w-80 flex-shrink-0">
                        <PropertyCard property={prop as any} />
                    </div>
                ))}
            </LiveFeedSection>

            <LiveFeedSection title={productsAreNearby ? "Products Near You" : "Latest Products"} link="/marketplace" isLoading={isProductsLoading} count={productsToShow.length}>
                {productsToShow.map(prod => (
                    <div key={prod.id} className="w-56 flex-shrink-0">
                        <ProductCard product={prod as any} />
                    </div>
                ))}
            </LiveFeedSection>
             
            <LiveFeedSection title={workersAreNearby ? "Workers Near You" : "Top Workers"} link="/find-a-worker" isLoading={isWorkersLoading} count={workersToShow.length}>
                 {workersToShow.map(worker => (
                    <div key={worker.id} className="w-80 flex-shrink-0">
                       <ProfessionalCard worker={worker as any} />
                    </div>
                ))}
            </LiveFeedSection>
        </div>
    );
}
