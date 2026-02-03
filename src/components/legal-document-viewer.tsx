'use client';

import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Shield, User, Package, IndianRupee, Info, LogIn, FileLock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { doc } from 'firebase/firestore';
import type { LegalAgreement } from '@/lib/entities';

// 1. Content Component जो useSearchParams का इस्तेमाल करता है
function LegalDocumentContent() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const firestore = useFirestore();
    
    const agreementId = searchParams.get('id');

    const agreementRef = useMemoFirebase(() => {
        if (!firestore || !agreementId) return null;
        return doc(firestore, 'legal_agreements', agreementId);
    }, [firestore, agreementId]);

    const { data: deal, isLoading: isDealLoading } = useDoc<LegalAgreement>(agreementRef);
    
    const date = deal?.createdAt ? (deal.createdAt as any).toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '...';

    const handleDownload = () => {
        toast({
            title: "Download Initiated",
            description: "Your document is being prepared.",
            className: "bg-primary text-white border-primary"
        });
    };

    if (isUserLoading || (user && isDealLoading)) {
        return (
             <div className="space-y-4">
                <Card className="glass-card overflow-hidden">
                    <CardHeader className="bg-black/20 p-4">
                         <Skeleton className="h-5 w-3/4" />
                         <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                        <div className="space-y-2">
                             <Skeleton className="h-6 w-1/4 mb-2" />
                             <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <Card className="glass-card text-center p-8">
                <CardContent className="flex flex-col items-center gap-4">
                     <FileLock className="w-16 h-16 text-muted-foreground" />
                    <h3 className="text-xl font-bold font-headline">Access Denied</h3>
                    <Button onClick={() => router.push('/login')} className="mt-4">
                        <LogIn className="mr-2" /> Login / Sign Up
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    if (!deal) {
        return (
            <Card className="glass-card text-center p-8">
                <CardContent className="flex flex-col items-center gap-4">
                     <FileLock className="w-16 h-16 text-muted-foreground" />
                    <h3 className="text-xl font-bold font-headline">Agreement Not Found</h3>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="glass-card overflow-hidden">
                <CardHeader className="bg-black/20 p-4">
                    <p className="text-sm font-bold text-primary">GRIHSEVA AI - DIGITAL SECURITY AGREEMENT</p>
                    <div className="flex justify-between items-center">
                         <p className="text-xs text-muted-foreground font-mono">Deal ID: {deal.dealId}</p>
                          <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-900/30">
                               <Shield className="mr-2 h-3 w-3"/>Verified
                          </Badge>
                    </div>
                     <p className="text-xs text-muted-foreground">{date}</p>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><User size={20}/>Parties</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 bg-black/10 p-2 rounded-lg text-white">
                                <span className="font-semibold">{deal.sellerName || 'Seller'}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/10 p-2 rounded-lg text-white">
                                <span className="font-semibold">{deal.buyerName || user.displayName}</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Final Price:</p>
                        <p className="font-bold text-lg text-accent text-white">₹ {deal.finalPrice?.toLocaleString('en-IN')}</p>
                    </div>
                </CardContent>
                <CardFooter className="bg-black/20 p-4">
                     <p className="text-xs text-center text-muted-foreground w-full">Digitally Signed via GrihSeva AI</p>
                </CardFooter>
            </Card>

            <Button onClick={handleDownload} className="w-full h-14 bg-primary text-white">
                <Download className="mr-2" /> Download Agreement
            </Button>
        </div>
    );
}

// 2. Export Wrapper जो पक्का करता है कि Suspense हमेशा मौजूद रहे
export function LegalDocumentViewer() {
    return (
        <Suspense fallback={<div className="flex justify-center p-10 text-white"><Loader2 className="animate-spin mr-2" /> Loading Secure Vault...</div>}>
            <LegalDocumentContent />
        </Suspense>
    );
}