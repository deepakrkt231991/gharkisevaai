
// src/app/rent-tools/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import type { Tool, User as UserEntity } from '@/lib/entities';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, Grid, Droplet, Zap, Wrench, IndianRupee, MapPin, ArrowLeft, ArrowRight, Hammer, Paintbrush } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { doc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';


function ToolCard({ tool }: { tool: Tool & { id: string } }) {
    const firestore = useFirestore();
    const ownerRef = useMemoFirebase(() => {
        if (!firestore || !tool.ownerId) return null;
        return doc(firestore, 'users', tool.ownerId);
    }, [firestore, tool.ownerId]);
    
    const { data: owner } = useDoc<UserEntity>(ownerRef);

    return (
        <Card className="glass-card overflow-hidden">
            <div className="relative h-32 w-full">
                <Image 
                    src={tool.imageUrl || `https://picsum.photos/seed/${tool.id}/400/300`} 
                    alt={tool.name} 
                    fill 
                    className="object-cover"
                />
                 <Badge className="absolute top-2 left-2 bg-green-500/80 border-green-400 text-white">VERIFIED</Badge>
                 <Avatar className="absolute top-2 right-2 h-8 w-8 border-2 border-background">
                    <AvatarImage src={owner?.photoURL || `https://picsum.photos/seed/${tool.ownerId}/150/150`} />
                    <AvatarFallback>{owner?.name?.charAt(0) || 'O'}</AvatarFallback>
                </Avatar>
            </div>
            <CardContent className="p-3 space-y-2">
                <h3 className="font-bold truncate text-white">{tool.name}</h3>
                {tool.location && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12}/>{tool.location}</p>}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Rent</p>
                        <p className="text-lg font-bold text-accent">₹{tool.rental_price_per_day}<span className="text-xs text-muted-foreground">/day</span></p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Deposit</p>
                        <p className="font-bold text-white text-right">₹{tool.deposit || 0}</p>
                    </div>
                </div>
                 <Button asChild size="sm" className="w-full">
                    <Link href={`/chat/tool-${tool.id}`}>Rent Now</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function RegisterOwnerCard() {
    return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary/90 to-primary/60 text-white space-y-3">
            <h3 className="text-xl font-bold font-headline">Have tools lying idle?</h3>
            <p className="text-sm text-white/80">List them here and start earning passive income today.</p>
            <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg">
                <Link href="/list-tool">Register as Owner</Link>
            </Button>
        </div>
    );
}

function ToolLibraryHeader() {
    const { user } = useUser();
    return (
         <header className="sticky top-0 z-50 flex flex-col gap-4 bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg"><Wrench className="text-white" size={20}/></div>
                    <div>
                        <h1 className="font-bold text-xl font-headline text-white">TOOL LIBRARY</h1>
                        <p className="text-xs text-muted-foreground">Rent from pros near you</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-6 w-6 text-white" />
                         <span className="absolute right-1 top-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                        </span>
                    </Button>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/150/150`} />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Search drills, wrenches, ladders..."
                    className="w-full rounded-full bg-input pl-10 h-12 text-white border-border-dark"
                />
            </div>
        </header>
    )
}


export default function RentToolsPage() {
    const firestore = useFirestore();
    const [activeFilter, setActiveFilter] = useState('All Tools');
    
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
    
    const toolsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // For now, fetch all tools. Add filtering/sorting as needed.
        return query(collection(firestore, 'tools'));
    }, [firestore]);

    const { data: tools, isLoading } = useCollection<Tool>(toolsQuery);

    return (
        <div className="dark bg-background text-foreground">
            <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
                <ToolLibraryHeader />
                <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
                    <div className="relative">
                        <div className="overflow-hidden -mx-4" ref={emblaRef}>
                            <div className="flex gap-3 pb-2 px-4">
                                <Button onClick={() => setActiveFilter('All Tools')} variant={activeFilter === 'All Tools' ? 'default' : 'secondary'} className="rounded-full h-10 flex-shrink-0 whitespace-nowrap"><Grid size={16} className="mr-2"/> All Tools</Button>
                                <Button onClick={() => setActiveFilter('Plumbing')} variant={activeFilter === 'Plumbing' ? 'default' : 'secondary'} className="rounded-full h-10 bg-card text-white flex-shrink-0 whitespace-nowrap"><Droplet size={16} className="mr-2"/> Plumbing</Button>
                                <Button onClick={() => setActiveFilter('Electric')} variant={activeFilter === 'Electric' ? 'default' : 'secondary'} className="rounded-full h-10 bg-card text-white flex-shrink-0 whitespace-nowrap"><Zap size={16} className="mr-2"/> Electric</Button>
                                <Button onClick={() => setActiveFilter('Painting')} variant={activeFilter === 'Painting' ? 'default' : 'secondary'} className="rounded-full h-10 bg-card text-white flex-shrink-0 whitespace-nowrap"><Paintbrush size={16} className="mr-2"/> Painting</Button>
                                <Button onClick={() => setActiveFilter('Carpentry')} variant={activeFilter === 'Carpentry' ? 'default' : 'secondary'} className="rounded-full h-10 bg-card text-white flex-shrink-0 whitespace-nowrap"><Hammer size={16} className="mr-2"/> Carpentry</Button>
                            </div>
                        </div>
                        <Button
                            onClick={scrollPrev}
                            disabled={prevBtnDisabled}
                            variant="outline"
                            size="icon"
                            className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background z-10"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                        <Button
                            onClick={scrollNext}
                            disabled={nextBtnDisabled}
                            variant="outline"
                            size="icon"
                            className="absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background z-10"
                        >
                            <ArrowRight size={16} />
                        </Button>
                    </div>

                    <RegisterOwnerCard />

                     <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold font-headline text-white">Available Near You</h2>
                            <button className="text-sm font-bold text-primary">VIEW MAP</button>
                        </div>
                        
                        {isLoading && (
                             <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-32 w-full rounded-xl" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoading && tools && tools.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {tools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} />
                                ))}
                            </div>
                        )}
                        
                        {!isLoading && (!tools || tools.length === 0) && (
                            <div className="text-center py-16 text-muted-foreground">
                                <Wrench className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No Tools Available</h3>
                                <p className="mt-1 text-sm">Check back later or be the first to list a tool!</p>
                            </div>
                        )}
                    </div>
                </main>
                <BottomNavBar />
            </div>
        </div>
    );
}

    

    