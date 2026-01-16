'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Download, Share2, Clock, User, IndianRupee, File, LogIn, FileLock } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, Timestamp } from 'firebase/firestore';
import type { LegalAgreement } from '@/lib/entities';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


const VerificationStatusCard = () => {
    // This would be fetched from user's profile data
    const verificationProgress = 95;

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-white flex items-center gap-2">
                        <ShieldCheck className="text-accent" />
                        AI Verification Status
                    </CardTitle>
                    <span className="text-sm font-bold text-accent">{verificationProgress}%</span>
                </div>
                <CardDescription>Complete your profile for higher trust.</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={verificationProgress} className="w-full h-2 [&>div]:bg-accent" />
                <p className="text-xs text-muted-foreground mt-2">Aadhar and PAN card verified. Rental deed pending.</p>
            </CardContent>
        </Card>
    );
};

const ActiveAgreementCard = ({ agreement }: { agreement: LegalAgreement & { id: string } }) => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

    useEffect(() => {
        if (!agreement.createdAt) return;
        const agreementTime = (agreement.createdAt as Timestamp).toDate().getTime();
        const endTime = agreementTime + (24 * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endTime - now;
            if (distance > 0) {
                setTimeLeft(distance / 1000);
            } else {
                setTimeLeft(0);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [agreement.createdAt]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <Card className="glass-card border-l-4 border-yellow-500">
            <CardHeader>
                <CardTitle className="font-headline text-white text-lg">Active Agreements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="bg-black/20 p-3 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-muted-foreground font-mono">Deal ID: {agreement.dealId}</p>
                            <h4 className="font-bold text-white mt-1">{agreement.itemName}</h4>
                        </div>
                         <div className="text-right">
                             <p className="text-xl font-bold text-accent">₹{agreement.finalPrice}</p>
                             <p className="text-xs text-muted-foreground">with {agreement.sellerName}</p>
                         </div>
                    </div>
                    <div className="border-t border-border my-3"></div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <Clock className="text-yellow-500 w-5 h-5"/>
                            <div>
                                <p className="text-xs text-yellow-500 font-bold">WAITING TIMER</p>
                                <p className="font-mono font-bold text-lg text-white">{formatTime(timeLeft)}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent" asChild>
                            <Link href={`/chat/${agreement.dealId}`}>View Deal</Link>
                        </Button>
                    </div>
                 </div>
            </CardContent>
        </Card>
    );
};

const CompletedDealsList = ({ agreements }: { agreements: (LegalAgreement & {id: string})[] }) => {
    const { toast } = useToast();

    const handleDownload = (dealId: string) => {
        toast({
            title: "Download Initiated",
            description: `Preparing PDF for deal ${dealId}. This is a demo feature.`,
            className: "bg-primary text-white border-primary"
        });
    };
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-white text-lg">Completed Deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {agreements.map(deal => (
                    <div key={deal.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-border">
                        <FileText className="text-green-400" />
                        <div className="flex-1">
                            <p className="font-semibold text-white">{deal.itemName}</p>
                            <p className="text-xs text-muted-foreground">
                                {deal.sellerName} • {deal.createdAt ? new Date((deal.createdAt as Timestamp).toDate()).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => handleDownload(deal.dealId)}>
                                 <Download className="w-4 h-4"/>
                             </Button>
                             <Button variant="ghost" size="icon" className="w-9 h-9"><Share2 className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
};

export function LegalVault() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const agreementsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'legal_agreements'));
    }, [firestore]);
    
    const { data: allAgreements, isLoading: areAgreementsLoading } = useCollection<LegalAgreement>(agreementsQuery);
    
    const userAgreements = useMemo(() => {
        if (!allAgreements || !user) return [];
        return allAgreements.filter(a => a.buyerId === user.uid || a.sellerId === user.uid);
    }, [allAgreements, user]);

    const activeAgreements = useMemo(() => userAgreements.filter(a => a.status === 'active'), [userAgreements]);
    const completedAgreements = useMemo(() => userAgreements.filter(a => a.status === 'completed'), [userAgreements]);

    if (isUserLoading || (user && areAgreementsLoading)) {
       return (
            <div className="space-y-6">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }
    
    if (!user) {
        return (
            <Card className="glass-card text-center p-8">
                <CardContent className="flex flex-col items-center gap-4">
                     <FileLock className="w-16 h-16 text-muted-foreground" />
                    <h3 className="text-xl font-bold font-headline">Access Denied</h3>
                    <p className="text-muted-foreground">Please log in to view your legal documents.</p>
                    <Button onClick={() => router.push('/login')} className="mt-4">
                        <LogIn className="mr-2" />
                        Login / Sign Up
                    </Button>
                </CardContent>
            </Card>
        );
    }

  return (
    <div className="space-y-6">
        <VerificationStatusCard />
        
        {activeAgreements.length > 0 ? (
            activeAgreements.map(agreement => <ActiveAgreementCard key={agreement.id} agreement={agreement} />)
        ) : (
             <Card className="glass-card border-l-4 border-gray-600">
                <CardHeader>
                    <CardTitle className="font-headline text-white text-lg">Active Agreements</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-4">No active agreements.</p>
                </CardContent>
            </Card>
        )}
        
        {completedAgreements.length > 0 ? (
             <CompletedDealsList agreements={completedAgreements} />
        ) : (
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="font-headline text-white text-lg">Completed Deals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-4">No completed deals yet.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
