'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/entities';
import { timeAgo } from '@/lib/time-helpers';
import { useState, useEffect } from 'react';

interface ProductCardProps {
    product: Product & { id: string };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [timeDisplay, setTimeDisplay] = useState('');

    useEffect(() => {
        if (product.createdAt) {
            setTimeDisplay(timeAgo(product.createdAt));
        }
    }, [product.createdAt]);

    return (
        <Link href={`/product-detail?id=${product.id}`} className={className}>
            <Card className="rounded-xl overflow-hidden glass-card border-border group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                            src={product.imageUrls?.[0] || 'https://placehold.co/400x500?text=No+Image'}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                         {product.isReserved && (
                            <Badge className="absolute top-2 left-2 bg-yellow-600/80 text-white backdrop-blur-sm border-none uppercase text-xs tracking-widest">RESERVED</Badge>
                        )}
                        <div className="absolute top-2 right-2 rounded-full h-8 w-8 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
                            <Heart className="h-4 w-4" />
                        </div>
                        {product.createdAt && timeDisplay && (
                            <Badge variant="secondary" className="absolute bottom-2 left-2 bg-black/50 text-white backdrop-blur-sm border-none text-xs">
                                {timeDisplay}
                            </Badge>
                        )}
                    </div>
                    <div className="p-3 space-y-1 flex-grow flex flex-col justify-end">
                        <h3 className="font-bold text-white truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12}/>{product.location}</p>
                        <p className="text-lg font-bold text-white pt-1">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
