'use client';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, ShieldCheck, ParkingCircle, Scale, Scaling } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import type { Property } from '@/lib/entities';

interface PropertyCardProps {
    property: Property & {id: string};
}

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link href={`/property-detail?id=${property.id}`} className="block space-y-3">
             <Card className="relative h-60 w-full overflow-hidden rounded-2xl group border-2 border-transparent hover:border-primary transition-all duration-300">
                <Image
                    src={property.imageUrl || `https://picsum.photos/seed/${property.id}/800/600`}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-between">
                    <div>
                         {property.isAiVerified && (
                             <Badge className="bg-black/50 text-white border-white/20 backdrop-blur-sm">
                                <ShieldCheck className="w-3 h-3 mr-1 text-yellow-400" />
                                AI VERIFIED
                            </Badge>
                         )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">₹{property.price} {property.priceUnit}</h3>
                        <p className="text-sm text-white/90 font-medium">{property.title}, {property.location}</p>
                    </div>
                </div>
                 <Button size="icon" variant="secondary" className="absolute top-4 right-4 bg-black/30 text-white rounded-full backdrop-blur-sm h-9 w-9">
                    <Heart className="w-5 h-5"/>
                </Button>
            </Card>
            <div className="flex justify-around text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                    <Scaling className="w-4 h-4" />
                    <span>{property.sqft} sqft</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ParkingCircle className="w-4 h-4" />
                    <span>{property.parking} Parking</span>
                </div>
                 <div className="flex items-center gap-1.5 text-primary font-bold">
                    <Scale className="w-4 h-4" />
                    <span>AI Legal Assist</span>
                </div>
            </div>
        </Link>
    );
}
