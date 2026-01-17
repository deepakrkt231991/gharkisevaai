
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Property } from '@/lib/entities';
import { 
    ArrowLeft, 
    Heart, 
    Share2, 
    MapPin, 
    Diamond, 
    Scaling, 
    ParkingCircle, 
    MessageSquare, 
    Sparkles, 
    FileText,
    Waves,
    Dumbbell,
    ShieldCheck,
    BatteryCharging,
    TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl h-24 text-center">
        <Icon className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <p className="text-sm font-extrabold text-white">{value}</p>
    </div>
);

const AmenityIcon = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);

export function PropertyDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('id');
    const firestore = useFirestore();

    const propertyRef = useMemoFirebase(() => {
        if (!firestore || !propertyId) return null;
        return doc(firestore, 'properties', propertyId);
    }, [firestore, propertyId]);

    const { data: property, isLoading } = useDoc<Property>(propertyRef);

    if (isLoading) {
        return (
            <div className="flex-1">
                 <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                </header>
                 <main>
                    <Skeleton className="w-full aspect-[4/3]" />
                    <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-6 pb-24">
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-3/4"/>
                            <Skeleton className="h-5 w-1/2"/>
                            <Skeleton className="h-10 w-1/3"/>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                         <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </div>
                    </div>
                 </main>
            </div>
        )
    }

    if (!property) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                 <h2 className="text-2xl font-bold font-headline">Property not found</h2>
                 <p className="text-muted-foreground">The property you are looking for does not exist.</p>
                 <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        )
    }

    return (
        <div className="flex-1">
            <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-black/20 text-white hover:bg-black/40 hover:text-white">
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/40 hover:text-white"><Heart /></Button>
                    <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/40 hover:text-white"><Share2 /></Button>
                </div>
            </header>

            <main>
                <div className="relative w-full aspect-[4/3]">
                    <Image 
                        src={property.imageUrl || `https://picsum.photos/seed/${property.id}/800/600`}
                        alt={property.title}
                        fill
                        className="object-cover"
                        data-ai-hint="modern house exterior"
                    />
                </div>
                
                <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-6 pb-24">
                    {/* Property Info */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold font-headline text-white">{property.title}</h1>
                            {property.isAiVerified && (
                                <Badge variant="outline" className="text-yellow-400 border-yellow-500/50 bg-yellow-900/30 font-bold mt-1">VERIFIED</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>{property.location}</span>
                        </div>
                        <div className="flex items-baseline gap-2 pt-1">
                             <p className="text-4xl font-extrabold text-white">₹{property.price} {property.priceUnit}</p>
                             <p className="text-muted-foreground font-medium">₹{Math.round((property.price * (property.priceUnit === 'Cr' ? 10000000 : 100000)) / property.sqft).toLocaleString('en-IN')} / sq.ft.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={Scaling} label="AREA" value={`${property.sqft} sqft`} />
                        <StatCard icon={Diamond} label="VASTU" value={property.vastuScore ? `${property.vastuScore} / 10` : 'N/A'} />
                        <StatCard icon={ParkingCircle} label="PARKING" value={`${property.parking} Slots`} />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="h-14 text-base" asChild>
                            <Link href={`/chat/deal-${property.id}`}>
                                <MessageSquare className="mr-2"/> Chat Owner
                            </Link>
                        </Button>
                         <Button variant="default" className="h-14 text-base bg-primary" asChild>
                            <Link href="/legal-vault">
                                <Sparkles className="mr-2"/> AI Legal Help
                            </Link>
                        </Button>
                    </div>

                    {/* AI Legal Assistance */}
                    <Card className="glass-card p-4 space-y-3 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <h3 className="font-bold font-headline text-white">AI Legal Assistance</h3>
                        <p className="text-sm text-muted-foreground">Instantly generate legally binding rent or sale agreements, optimized for local jurisdiction.</p>
                        <Button variant="default" asChild className="w-full h-12 bg-white text-black hover:bg-gray-200">
                           <Link href={`/legal-vault?dealId=${property.id}`}>
                                <FileText className="mr-2"/> Generate Agreement
                           </Link>
                        </Button>
                    </Card>
                    
                    {/* About Property */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-headline text-white">About this property</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Designed by award-winning architects, this villa offers a seamless blend of indoor and outdoor living. Features include a double-height foyer, automated smart lighting, and a private infinity pool overlooking the valley.
                        </p>
                    </div>

                    {/* Amenities */}
                     <div className="space-y-3">
                        <h3 className="text-xl font-bold font-headline text-white">Amenities</h3>
                        <div className="flex justify-around pt-2">
                           <AmenityIcon icon={Waves} label="Pool"/>
                           <AmenityIcon icon={Dumbbell} label="Gym"/>
                           <AmenityIcon icon={ShieldCheck} label="24/7 Sec"/>
                           <AmenityIcon icon={BatteryCharging} label="EV Charge"/>
                           <AmenityIcon icon={TreePine} label="Garden"/>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
