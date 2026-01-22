
'use client';

import { Home, Bell, ShoppingBag, Search, SlidersHorizontal, Plus, Heart, MessageSquare, User, MapPin, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';

const MarketplaceHeader = () => (
     <header className="sticky top-0 z-40 flex flex-col gap-4 bg-background/80 p-4 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2">
                <Home className="h-6 w-6 text-white" />
                <h1 className="font-bold text-xl font-headline text-white">GrihSeva AI</h1>
            </Link>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6 text-white" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/list-item">
                        <Plus className="h-6 w-6 text-white" />
                    </Link>
                </Button>
                 <Button variant="ghost" size="icon">
                    <ShoppingBag className="h-6 w-6 text-white" />
                </Button>
            </div>
        </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search for home items..."
                className="w-full rounded-md bg-input pl-10 pr-12 h-12 text-white border-border"
                onChange={(e) => (window as any).setMarketplaceSearchTerm(e.target.value)}
            />
             <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9">
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
    </header>
);

const MarketplaceBottomNav = () => {
    const navItems = [
        { href: '/marketplace', label: 'EXPLORE', icon: Home },
        { href: '#', label: 'SAVED', icon: Heart },
        { href: '#', label: 'INBOX', icon: MessageSquare },
        { href: '/profile', label: 'PROFILE', icon: User },
    ];
    const pathname = '/marketplace'; // Mock pathname for active state

    return (
         <footer className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 z-50">
            <div className="grid h-20 grid-cols-4 items-center border-t border-border bg-card/80 backdrop-blur-sm">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            href={item.href}
                            key={item.label}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                                isActive && 'text-primary'
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </footer>
    )
}

// New CTA Card component
const ListItemCtaCard = () => (
    <Card className="glass-card mt-6">
        <CardContent className="p-5 space-y-3 text-center">
             <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Tag className="w-8 h-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold font-headline text-white">Ready to Sell Your Items?</h3>
            <p className="text-sm text-muted-foreground">
                List your used furniture, electronics, and appliances on GrihSeva AI to reach thousands of buyers. Our AI tools will help you get the best price.
            </p>
            <Button asChild className="mt-2">
                <Link href="/list-item">
                    List Your Item Now
                </Link>
            </Button>
        </CardContent>
    </Card>
);


export default function MarketplacePage() {
    const firestore = useFirestore();
    
    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<Product>(productsQuery);
    
    const [activeFilter, setActiveFilter] = useState('All Items');
    const [searchTerm, setSearchTerm] = useState('');
    
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


    if (typeof window !== 'undefined') {
        (window as any).setMarketplaceSearchTerm = setSearchTerm;
    }

    const filteredProducts = useMemo(() => {
        const demoProducts: (Product & { id: string })[] = PlaceHolderImages
            .filter(p => p.type === 'product')
            .map(p => ({
                id: p.id,
                productId: p.id,
                ownerId: 'demo-user-' + p.id,
                name: p.name || 'Demo Item',
                category: p.category,
                price: p.price || 0,
                description: p.description || 'This is a demo item.',
                location: p.location || 'Unknown Location',
                imageUrls: p.imageUrl ? [p.imageUrl] : ['https://placehold.co/400x500?text=No+Image'],
                isReserved: !!p.isReserved,
                isReservedEnabled: !!p.isReserved,
                createdAt: null,
            }));

        const realProductIds = new Set(products?.map(p => p.id));
        const uniqueDemoProducts = demoProducts.filter(p => !realProductIds.has(p.id));

        const combinedProducts = [...uniqueDemoProducts, ...(products || [])];

        let tempProducts = combinedProducts;

        if (activeFilter !== 'All Items') {
            tempProducts = tempProducts.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase());
        }

        if (searchTerm) {
            tempProducts = tempProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return tempProducts;
    }, [products, activeFilter, searchTerm]);


    return (
        <div className="dark bg-background text-foreground">
            <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
                <MarketplaceHeader />
                <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
                    <Tabs defaultValue="buy" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-card h-14 rounded-xl p-1">
                             <TabsTrigger value="buy" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                                <ShoppingBag /> Buy Items
                            </TabsTrigger>
                            <TabsTrigger value="sell" className="h-full rounded-lg text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                                <Tag /> Sell Items
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="buy" className="pt-6 space-y-6">
                            <div className="relative">
                                <div className="overflow-hidden" ref={emblaRef}>
                                    <div className="flex gap-2 pb-2 -mx-4 px-4">
                                        <Button onClick={() => setActiveFilter('All Items')} className="rounded-full h-10 whitespace-nowrap flex-shrink-0" variant={activeFilter === 'All Items' ? 'default' : 'secondary'}>ALL ITEMS</Button>
                                        <Button onClick={() => setActiveFilter('Furniture')} className="rounded-full h-10 whitespace-nowrap flex-shrink-0" variant={activeFilter === 'Furniture' ? 'default' : 'secondary'}>FURNITURE</Button>
                                        <Button onClick={() => setActiveFilter('Electronics')} className="rounded-full h-10 whitespace-nowrap flex-shrink-0" variant={activeFilter === 'Electronics' ? 'default' : 'secondary'}>ELECTRONICS</Button>
                                        <Button onClick={() => setActiveFilter('Appliances')} className="rounded-full h-10 whitespace-nowrap flex-shrink-0" variant={activeFilter === 'Appliances' ? 'default' : 'secondary'}>APPLIANCES</Button>
                                    </div>
                                </div>
                                <Button
                                    onClick={scrollPrev}
                                    disabled={prevBtnDisabled}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background"
                                >
                                    <ArrowLeft size={16} />
                                </Button>
                                <Button
                                    onClick={scrollNext}
                                    disabled={nextBtnDisabled}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background"
                                >
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                            {isLoading ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-56 w-full rounded-xl" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product as Product & { id: string }} />
                                    )) : <p className="col-span-2 text-center text-muted-foreground py-10">No products found in this category.</p>}
                                </div>
                            )}
                        </TabsContent>

                         <TabsContent value="sell" className="pt-6 space-y-6">
                            <ListItemCtaCard />
                        </TabsContent>
                    </Tabs>
                </main>
                <MarketplaceBottomNav />
            </div>
        </div>
    );
}
