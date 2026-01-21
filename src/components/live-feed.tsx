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
    const propertiesQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'properties'), orderBy('createdAt', 'desc'), limit(20)), [firestore]);
    const productsQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'products'), orderBy('createdAt', 'desc'), limit(20)), [firestore]);
    const workersQuery = useMemoFirebase(() => !firestore ? null : query(collection(firestore, 'workers'), where('isVerified', '==', true), limit(20)), [firestore]);

    const { data: allProperties, isLoading: isPropertiesLoading } = useCollection<Property>(propertiesQuery);
    const { data: allProducts, isLoading: isProductsLoading } = useCollection<Product>(productsQuery);
    const { data: allWorkers, isLoading: isWorkersLoading } = useCollection<Worker>(workersQuery);

    // --- Filtering and Fallback Logic ---
    const getFilteredAndSortedItems = <T extends { geo?: { latitude: number; longitude: number; } } | { location?: { latitude: number; longitude: number; } }>(items: (T & {id: string})[] | null) => {
        if (!items || isGeoLoading) return { displayItems: items || [], isNearby: false };
        if (!userLat || !userLon) return { displayItems: items, isNearby: false };

        const nearby = items.filter(item => {
            const loc = (item as any).geo || (item as any).location;
            if (!loc?.latitude || !loc?.longitude) return false;
            const dist = calculateDistance(userLat, userLon, loc.latitude, loc.longitude);
            return dist <= DISTANCE_KM;
        });

        if (nearby.length > 0) {
            return { displayItems: nearby, isNearby: true };
        }
        
        return { displayItems: items, isNearby: false }; // Fallback to global
    };

    const { displayItems: propertiesToShow, isNearby: propertiesAreNearby } = useMemo(() => getFilteredAndSortedItems(allProperties), [allProperties, userLat, userLon, isGeoLoading]);
    const { displayItems: productsToShow, isNearby: productsAreNearby } = useMemo(() => getFilteredAndSortedItems(allProducts), [allProducts, userLat, userLon, isGeoLoading]);
    const { displayItems: workersToShowRaw, isNearby: workersAreNearby } = useMemo(() => getFilteredAndSortedItems(allWorkers), [allWorkers, userLat, userLon, isGeoLoading]);

    // Merge workers with placeholders
    const workersToShow = useMemo(() => {
        const demoWorkers = PlaceHolderImages.filter(p => p.type === 'worker');
        const realWorkerIds = new Set(workersToShowRaw?.map(w => w.id));
        const uniqueDemoWorkers = demoWorkers.filter(p => !realWorkerIds.has(p.id));
        const combined = [...(workersToShowRaw || []), ...uniqueDemoWorkers];
        return combined.slice(0, 10);
    }, [workersToShowRaw]);
    
    return (
        <div className="space-y-8">
            <LiveFeedSection title={propertiesAreNearby ? "Homes Near You" : "Latest Homes"} link="/explore" isLoading={isPropertiesLoading} count={propertiesToShow.length}>
                {propertiesToShow.map(prop => (
                    <div key={prop.id} className="w-80 flex-shrink-0">
                        <PropertyCard property={prop} />
                    </div>
                ))}
            </LiveFeedSection>

            <LiveFeedSection title={productsAreNearby ? "Products Near You" : "Latest Products"} link="/marketplace" isLoading={isProductsLoading} count={productsToShow.length}>
                {productsToShow.map(prod => (
                    <div key={prod.id} className="w-56 flex-shrink-0">
                        <ProductCard product={prod} />
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
