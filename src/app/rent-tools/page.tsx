// src/app/rent-tools/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query } from 'firebase/firestore';
import type { Tool } from '@/lib/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, Grid, Droplet, Zap, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function ToolCard({ tool }: { tool: Tool & { id: string } }) {
    const ownerImage = PlaceHolderImages.find(p => p.id.startsWith('worker'))?.imageUrl || "https://i.pravatar.cc/150";
    return (
        <Card className="glass-card overflow-hidden">
            <div className="relative h-32 w-full">
                <Image 
                    src={`https://picsum.photos/seed/${tool.id}/400/300`} 
                    alt={tool.name} 
                    fill 
                    className="object-cover"
                />
                 <Badge className="absolute top-2 left-2 bg-green-500/80 border-green-400 text-white">VERIFIED</Badge>
                 <Avatar className="absolute top-2 right-2 h-8 w-8 border-2 border-background">
                    <AvatarImage src={ownerImage} />
                    <AvatarFallback>{tool.ownerId.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <CardContent className="p-3">
                <h3 className="font-bold truncate text-white">{tool.name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-bold text-accent">₹{tool.rental_price_per_day}<span className="text-xs text-muted-foreground"> /day</span></p>
                    {/* <Button size="sm" variant="outline" className="bg-transparent h-8">Rent</Button> */}
                </div>
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
                        <AvatarImage src={user?.photoURL || "https://i.pravatar.cc/150"} />
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
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <Button className="rounded-full bg-primary h-10"><Grid size={16} className="mr-2"/> All Tools</Button>
                        <Button variant="secondary" className="rounded-full h-10 bg-surface-dark text-white"><Droplet size={16} className="mr-2"/> Plumbing</Button>
                        <Button variant="secondary" className="rounded-full h-10 bg-surface-dark text-white"><Zap size={16} className="mr-2"/> Electric</Button>
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

const Wrench = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
)
