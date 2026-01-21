'use client';

import { Home, Bell, ShoppingBag, Search, SlidersHorizontal, Plus, Heart, MessageSquare, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- ProductCard Component ---
interface ProductCardProps {
    product: Product & { id: string };
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product-detail?id=${product.id}`}>
            <Card className="rounded-xl overflow-hidden glass-card border-border group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image
                            src={product.imageUrls?.[0] || 'https://placehold.co/400x500?text=No+Image'}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.isReservedEnabled && !product.isReserved && (
                            <Badge className="absolute top-3 left-3 bg-gray-900/70 text-white backdrop-blur-sm border-none uppercase text-xs tracking-widest">RESERVE AVAILABLE</Badge>
                        )}
                         {product.isReserved && (
                            <Badge className="absolute top-3 left-3 bg-yellow-600/80 text-white backdrop-blur-sm border-none uppercase text-xs tracking-widest">RESERVED</Badge>
                        )}
                        <div className="absolute top-3 right-3 rounded-full h-9 w-9 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
                            <Heart className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="p-4 space-y-1 flex-grow flex flex-col justify-end">
                        <h3 className="font-bold text-white truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={14}/>{product.location}</p>
                        <p className="text-lg font-bold text-white pt-1">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
// --- End ProductCard Component ---

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

export default function MarketplacePage() {
    const firestore = useFirestore();
    
    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: products, isLoading } = useCollection<Product>(productsQuery);
    
    const [activeFilter, setActiveFilter] = useState('All Items');
    const [searchTerm, setSearchTerm] = useState('');

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
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                        <Button onClick={() => setActiveFilter('All Items')} className="rounded-full h-10 whitespace-nowrap" variant={activeFilter === 'All Items' ? 'default' : 'secondary'}>ALL ITEMS</Button>
                        <Button onClick={() => setActiveFilter('Furniture')} className="rounded-full h-10 whitespace-nowrap" variant={activeFilter === 'Furniture' ? 'default' : 'secondary'}>FURNITURE</Button>
                        <Button onClick={() => setActiveFilter('Electronics')} className="rounded-full h-10 whitespace-nowrap" variant={activeFilter === 'Electronics' ? 'default' : 'secondary'}>ELECTRONICS</Button>
                        <Button onClick={() => setActiveFilter('Appliances')} className="rounded-full h-10 whitespace-nowrap" variant={activeFilter === 'Appliances' ? 'default' : 'secondary'}>APPLIANCES</Button>
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
                </main>
                <MarketplaceBottomNav />
            </div>
        </div>
    );
}
