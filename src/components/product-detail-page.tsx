

'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share, Heart, CheckCircle, Phone, MessageSquare, MapPin, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product, User as UserEntity } from '@/lib/entities';
import { Skeleton } from './ui/skeleton';
import { reserveProduct } from '@/app/product-detail/actions';
import { useToast } from '@/hooks/use-toast';
import AdsenseBanner from './adsense-banner';


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

function ReserveButton({ product, isReserved } : { product: Product, isReserved?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isReserved} className="w-full">
      {pending ? <Loader2 className="mr-2 animate-spin" /> : <Lock className="mr-2"/>}
      Pay ₹{(product.price * 0.07).toLocaleString('en-IN')} to Reserve (10 Days)
    </Button>
  )
}

export function ProductDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const productId = searchParams.get('id');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const firestore = useFirestore();
  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const sellerId = product?.ownerId;
  const sellerRef = useMemoFirebase(() => {
    if (!firestore || !sellerId) return null;
    return doc(firestore, 'users', sellerId);
  }, [firestore, sellerId]);
  const { data: seller, isLoading: isSellerLoading } = useDoc<UserEntity>(sellerRef);

  const isLoading = isProductLoading || (product && isSellerLoading);

  const handleReservation = async (formData: FormData) => {
    if (!productId || !product || !user) return;
    
    const result = await reserveProduct(productId, product, user.uid);
    if(result.success) {
        toast({
            title: "Product Reserved!",
            description: result.message,
            className: "bg-green-600 text-white"
        });
        // Redirect to the newly created deal chat
        if (result.dealId) {
            router.push(`/chat/deal-${result.dealId}`);
        }
    } else {
        toast({
            title: "Reservation Failed",
            description: result.message,
            variant: "destructive"
        });
    }
  }
  
  if (isLoading) {
    return (
        <div className="flex flex-col h-screen bg-background p-4 space-y-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-14 w-full" />
        </div>
    );
  }

  if (!product) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-screen bg-background text-center p-4">
            <p className="text-lg font-semibold text-white">Product not found</p>
            <p className="text-sm text-muted-foreground">The item you are looking for might have been sold or removed.</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
    );
  }
  
  const productImages = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['https://placehold.co/800x800?text=No+Image'];
  const chatLink = product.activeDealId ? `/chat/deal-${product.activeDealId}` : `/chat/product-${productId}`;

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
                    ₹{product.price?.toLocaleString('en-IN')}
                  </Badge>
              </div>
            </Carousel>
        </div>

        {/* Product & Seller Info */}
        <div className="p-4 space-y-4 pb-24">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-headline">{product.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin size={14} /> {product.location}
              </p>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-900/30">
              <CheckCircle size={14} className="mr-1"/> VERIFIED SELLER
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{product.description}</p>

          <Card className="glass-card">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={seller?.photoURL || `https://picsum.photos/seed/${'\'\''}${seller?.uid}/150/150`} />
                  <AvatarFallback>{seller?.name?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-white">{seller?.name || 'Seller'}</p>
                  <p className="text-xs text-muted-foreground">Member since 2024</p>
                </div>
              </div>
              <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-white">
                    <span>4.9</span> <span className="text-yellow-400">★</span>
                  </div>
                  <p className="text-xs text-muted-foreground">128 reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card p-1 my-4">
            <AdsenseBanner adSlot="2001427785" />
          </Card>
          
          {product.isReservedEnabled && (
               <Card className="glass-card border-primary/50">
                  <form action={handleReservation}>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Lock className="text-primary"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">10-Day Buyer Protection</h4>
                                <p className="text-xs text-muted-foreground">Secure this item with GrihSeva Escrow. 100% money-back guarantee.</p>
                            </div>
                        </div>
                        <ReserveButton product={product} isReserved={product.isReserved}/>
                    </CardContent>
                  </form>
               </Card>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-background to-transparent z-10">
        <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-14 text-base border-primary text-primary"><Phone className="mr-2"/> Call Seller</Button>
            <Button asChild className="h-14 text-base bg-primary text-primary-foreground">
              <Link href={chatLink}>
                  <MessageSquare className="mr-2"/> Message
              </Link>
            </Button>
          </div>
      </footer>
    </div>
  );
}
