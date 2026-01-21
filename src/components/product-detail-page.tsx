'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share, Heart, CheckCircle, Phone, MessageSquare, Send, Plus, Smile, MapPin, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';

const CarouselDots = ({ count, activeIndex }: { count: number, activeIndex: number }) => (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-4 bg-white' : 'w-2 bg-white/50'}`}
            />
        ))}
    </div>
);


export function ProductDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [activeIndex, setActiveIndex] = React.useState(0);

  // In a real app, this would be a Firestore `useDoc` hook.
  const product: ImagePlaceholder | undefined = PlaceHolderImages.find(p => p.id === productId);

  // Mock seller and chat for UI purposes
  const seller = {
    name: 'Sarah J.',
    avatar: 'https://i.pravatar.cc/150?u=sarah-j',
    since: '2021',
    itemsSold: 42,
    rating: 4.9,
    reviews: 128
  };

  const messages = [
      { id: 1, sender: 'other', text: "Hi! I'm interested in the armchair. Is it possible to see it today?", time: '11:42 AM' },
      { id: 2, sender: 'me', text: "Hello Sarah! Yes, I'm available after 5 PM today for a viewing. Does that work for you?", time: '11:45 AM' },
  ];

  if (!product) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-screen bg-background">
            <p className="text-lg font-semibold text-white">Product not found</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
    );
  }
  
  const productImages = [product.imageUrl, 'https://picsum.photos/seed/chair2/800/600', 'https://picsum.photos/seed/chair3/800/600'];

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative">
            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-black/20 text-white hover:bg-black/40 hover:text-white rounded-full">
                <ArrowLeft />
              </Button>
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/40 hover:text-white rounded-full"><Share /></Button>
                  <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/40 hover:text-white rounded-full"><Heart /></Button>
              </div>
            </header>

            {/* Image Carousel */}
            <Carousel setApi={(api) => {
                api?.on("select", () => setActiveIndex(api.selectedScrollSnap()));
            }} className="w-full relative">
              <CarouselContent>
                {productImages.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full aspect-[1/1.1]">
                        <Image
                          src={url}
                          alt={product.name || 'Product Image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots count={productImages.length} activeIndex={activeIndex} />
              <div className="absolute bottom-6 left-4">
                  <Badge variant="secondary" className="text-2xl font-bold p-3 rounded-lg bg-white/90 text-black shadow-lg">
                    ${product.price?.toFixed(2)}
                  </Badge>
              </div>
            </Carousel>
        </div>

        {/* Product & Seller Info */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-headline">{product.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} /> {product.location} • 2 miles away
              </p>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-900/30">
              <CheckCircle size={14} className="mr-1"/> VERIFIED
            </Badge>
          </div>

          <Card className="glass-card">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-white">{seller.name}</p>
                  <p className="text-xs text-muted-foreground">Seller since {seller.since} • {seller.itemsSold} items sold</p>
                </div>
              </div>
              <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-white">
                    <span>{seller.rating}</span> <span className="text-yellow-400">★</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{seller.reviews} reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-14 text-base border-primary text-primary"><Phone className="mr-2"/> Call Seller</Button>
            <Button asChild className="h-14 text-base bg-primary text-primary-foreground">
              <Link href={`/chat/product-${productId}`}>
                  <MessageSquare className="mr-2"/> Message
              </Link>
            </Button>
          </div>

           <Card className="glass-card border-primary/50">
             <CardContent className="p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="text-primary"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Pay Advance to Reserve (10 Days)</h4>
                        <p className="text-xs text-muted-foreground">Secure this item with GrihSeva Escrow. 100% money-back guarantee if the item doesn't match description.</p>
                    </div>
                </div>
                <ArrowRight className="text-muted-foreground"/>
            </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
