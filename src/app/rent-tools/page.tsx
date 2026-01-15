// src/app/rent-tools/page.tsx
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Wrench, UserCircle, Calendar } from 'lucide-react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import type { Tool } from '@/lib/entities';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function ToolCard({ tool }: { tool: Tool & { id: string } }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">{tool.name}</CardTitle>
                    {tool.is_available ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>
                    ) : (
                        <Badge variant="secondary">Rented Out</Badge>
                    )}
                </div>
                <CardDescription className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                    <UserCircle size={14} /> Owner: {tool.ownerId.substring(0, 8)}...
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{tool.description || 'No description available.'}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="font-bold text-lg flex items-center">
                    <IndianRupee size={18} className="mr-1" />
                    {tool.rental_price_per_day}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ day</span>
                </div>
                <Button disabled={!tool.is_available}>
                    <Calendar size={16} className="mr-2" />
                    Rent Now
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function RentToolsPage() {
    const firestore = useFirestore();
    
    const toolsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'tools'), where('is_available', '==', true));
    }, [firestore]);

    const { data: tools, isLoading } = useCollection<Tool>(toolsQuery);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 md:py-16">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Rent Tools from the Community</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Find the right tool for your job. Rent equipment from other verified workers nearby.
                        </p>
                         <Button asChild className="mt-4">
                            <Link href="/list-tool">
                                <Wrench className="mr-2" /> List Your Own Tool
                            </Link>
                        </Button>
                    </div>

                    {isLoading && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                    <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Skeleton className="h-8 w-1/3" />
                                        <Skeleton className="h-10 w-1/3" />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isLoading && tools && tools.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    )}
                    
                    {!isLoading && (!tools || tools.length === 0) && (
                        <div className="text-center py-16">
                            <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Tools Available</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Check back later or be the first to list a tool!</p>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
