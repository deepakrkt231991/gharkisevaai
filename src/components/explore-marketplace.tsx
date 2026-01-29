
'use client';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import type { Property } from '@/lib/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, ShoppingBag, Tag, KeyRound, Bot, Building } from 'lucide-react';
import { PropertyCard } from './property-card';
import { Skeleton } from './ui/skeleton';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AdsenseBanner from './adsense-banner';

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
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'buy';

    const salePropertiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'properties'), where('listingType', '==', 'sale'));
    }, [firestore]);

    const rentPropertiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'properties'), where('listingType', '==', 'rent'));
    }, [firestore]);

    const { data: saleProperties, isLoading: isSaleLoading } = useCollection<Property>(salePropertiesQuery);
    const { data: rentProperties, isLoading: isRentLoading } = useCollection<Property>(rentPropertiesQuery);

    const sortPropertiesByDistance = (properties: Property[] | null) => {
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
            if(a.geo) return -1; // properties with geo info first
            if(b.geo) return 1;
            return 0; // no geo info on both
        });
    }

    const combinedSaleProperties = useMemo(() => {
        const demoProperties: (Property & { id: string })[] = PlaceHolderImages
            .filter(p => p.type === 'property' && p.listingType === 'sale')
            .map(p => ({
                id: p.id,
                propertyId: p.id,
                ownerId: `demo-user-${p.id}`,
                title: p.title || 'Demo Sale Property',
                location: p.location || 'Unknown Location',
                price: p.price || 0,
                priceUnit: p.priceUnit || 'Cr',
                sqft: p.sqft || 0,
                parking: p.parking || 0,
                listingType: 'sale',
                imageUrl: p.imageUrl,
                isAiVerified: p.isAiVerified || false,
                vastuScore: p.vastuScore,
            } as Property & { id: string }));

        const realPropertyIds = new Set(saleProperties?.map(p => p.id));
        const uniqueDemoProperties = demoProperties.filter(p => !realPropertyIds.has(p.id));

        return sortPropertiesByDistance([...uniqueDemoProperties, ...(saleProperties || [])]);
    }, [saleProperties, userLat, userLon]);

    const combinedRentProperties = useMemo(() => {
        const demoProperties: (Property & { id: string })[] = PlaceHolderImages
            .filter(p => p.type === 'property' && p.listingType === 'rent')
            .map(p => ({
                id: p.id,
                propertyId: p.id,
                ownerId: `demo-user-${p.id}`,
                title: p.title || 'Demo Rent Property',
                location: p.location || 'Unknown Location',
                price: p.price || 0,
                priceUnit: p.priceUnit || 'L',
                sqft: p.sqft || 0,
                parking: p.parking || 0,
                listingType: 'rent',
                imageUrl: p.imageUrl,
                isAiVerified: p.isAiVerified || false,
                vastuScore: p.vastuScore,
            } as Property & { id: string }));

        const realPropertyIds = new Set(rentProperties?.map(p => p.id));
        const uniqueDemoProperties = demoProperties.filter(p => !realPropertyIds.has(p.id));

        return sortPropertiesByDistance([...uniqueDemoProperties, ...(rentProperties || [])]);
    }, [rentProperties, userLat, userLon]);


    const AiPriceEstimatorCard = () => (
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
    );
    
    const PropertyList = ({properties, isLoading}: {properties: (Property & { id: string })[], isLoading: boolean}) => (
        <div>
            <div className="flex justify-between items-center my-4">
                <h2 className="text-xl font-bold font-headline text-white">Curated for You</h2>
                <button className="text-sm font-bold text-primary">See All</button>
            </div>
            
            <div className="space-y-6">
                {isLoading && combinedSaleProperties.length === 0 && combinedRentProperties.length === 0 && (
                    <>
                        {[...Array(2)].map((_, i) => (
                             <div className="space-y-3" key={i}>
                                <Skeleton className="h-60 w-full rounded-2xl" />
                                <div className="flex justify-around">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </>
                )}
                
                {!isLoading && properties.flatMap((prop, index) => {
                    const content = [<PropertyCard key={prop.id} property={prop} />];
                    if ((index + 1) % 4 === 0) {
                        content.push(
                            <div key={`ad-${index}`} className="my-4 rounded-xl overflow-hidden glass-card p-2">
                                <AdsenseBanner adSlot="2001427785" />
                            </div>
                        );
                    }
                    return content;
                })}

                 {!isLoading && properties.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No properties found for this category.</p>
                         <p className="text-xs text-muted-foreground/50 mt-2">Check back later or list your own property!</p>
                    </div>
                )}
            </div>
        </div>
    );
    
    const ListPropertyCtaCard = ({ forRent }: { forRent?: boolean }) => (
        <Card className="glass-card mt-6">
            <CardContent className="p-5 space-y-3 text-center">
                 <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Building className="w-8 h-8 text-primary"/>
                </div>
                <h3 className="text-xl font-bold font-headline text-white">{forRent ? "Have a Property to Rent Out?" : "Ready to Sell?"}</h3>
                <p className="text-sm text-muted-foreground">
                    {forRent 
                        ? "List your room, flat, or house on GrihSeva AI to connect with verified tenants quickly and securely."
                        : "List your property on GrihSeva AI to reach thousands of verified buyers. Our AI tools will help you get the best price."
                    }
                </p>
                <Button asChild className="mt-2">
                    <Link href="/list-property">
                        {forRent ? "List Your Property for Rent" : "List Your Property for Sale"}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card h-14 rounded-xl p-1">
                    <TabsTrigger value="buy" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                        <ShoppingBag /> Buy Home
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                        <Tag /> Sell Home
                    </TabsTrigger>
                    <TabsTrigger value="rent" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                        <KeyRound /> Rent Home
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="buy" className="pt-6 space-y-6">
                    <AiPriceEstimatorCard />
                    <PropertyList properties={combinedSaleProperties} isLoading={isSaleLoading} />
                </TabsContent>
                <TabsContent value="sell" className="pt-6 space-y-6">
                    <AiPriceEstimatorCard />
                    <ListPropertyCtaCard />
                    <PropertyList properties={combinedSaleProperties} isLoading={isSaleLoading} />
                </TabsContent>
                <TabsContent value="rent" className="pt-6 space-y-6">
                    <PropertyList properties={combinedRentProperties} isLoading={isRentLoading} />
                    <ListPropertyCtaCard forRent />
                </TabsContent>
            </Tabs>
        </div>
    );
}
