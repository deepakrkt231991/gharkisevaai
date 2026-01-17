'use client';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import type { Property } from '@/lib/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, ShoppingBag, Tag, KeyRound, Bot } from 'lucide-react';
import { PropertyCard } from './property-card';
import { Skeleton } from './ui/skeleton';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useMemo } from 'react';

// Helper function to calculate distance (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


export function ExploreMarketplace() {
    const firestore = useFirestore();
    const { latitude: userLat, longitude: userLon } = useGeolocation();

    const propertiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // In a real app, we'd filter based on Buy/Sell/Rent. For now, fetch all.
        return query(collection(firestore, 'properties'));
    }, [firestore]);

    const { data: properties, isLoading } = useCollection<Property>(propertiesQuery);

    const sortedProperties = useMemo(() => {
        if (!properties) return [];
        if (userLat === null || userLon === null) return properties;

        return [...properties].sort((a, b) => {
            const geoA = a.geo;
            const geoB = b.geo;

            if (geoA?.latitude && geoA?.longitude && geoB?.latitude && geoB?.longitude) {
                 const distA = calculateDistance(userLat, userLon, geoA.latitude, geoA.longitude);
                 const distB = calculateDistance(userLat, userLon, geoB.latitude, geoB.longitude);
                 return distA - distB;
            }
            if(geoA) return -1; // properties with geo info first
            if(geoB) return 1;
            return 0; // no geo info on both
        });
    }, [properties, userLat, userLon]);

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card h-14 rounded-xl p-1">
                    <TabsTrigger value="buy" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <ShoppingBag className="mr-2" /> Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Tag className="mr-2" /> Sell
                    </TabsTrigger>
                    <TabsTrigger value="rent" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <KeyRound className="mr-2" /> Rent
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* AI Price Estimator Card */}
            <Card className="bg-gradient-to-br from-primary/90 to-primary/60 border-none text-white">
                <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                        <Bot /> PREMIUM TOOL
                    </div>
                    <h3 className="text-2xl font-bold font-headline">AI Price Estimator</h3>
                    <p className="text-sm text-white/80">Get a precise, real-time market valuation for any property using local data & neural trends.</p>
                    <Button variant="secondary" className="bg-white text-primary rounded-lg font-bold hover:bg-white/90">
                        Check Valuation Now <ArrowRight className="ml-2" />
                    </Button>
                </CardContent>
            </Card>

            {/* Curated Properties */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-headline text-white">Curated for You</h2>
                    <button className="text-sm font-bold text-primary">See All</button>
                </div>
                
                <div className="space-y-6">
                    {isLoading && (
                        <>
                            <div className="space-y-3">
                                <Skeleton className="h-60 w-full rounded-2xl" />
                                <div className="flex justify-around">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                             <div className="space-y-3">
                                <Skeleton className="h-60 w-full rounded-2xl" />
                                <div className="flex justify-around">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </>
                    )}
                    
                    {!isLoading && sortedProperties && sortedProperties.map(prop => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}

                     {!isLoading && (!sortedProperties || sortedProperties.length === 0) && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No properties found.</p>
                             <p className="text-xs text-muted-foreground/50 mt-2">In a real app, properties from Firestore would be displayed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

    