'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Download, Share2, Clock, User, IndianRupee, File } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const ActiveAgreementCard = () => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60 - (2 * 60 * 60 + 15 * 60)); // 21:45:00

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <Card className="glass-card border-l-4 border-primary">
            <CardHeader>
                <CardTitle className="font-headline text-white text-lg">Active Agreements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="bg-black/20 p-3 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-muted-foreground font-mono">Deal ID: GS-2026-A4B9C1</p>
                            <h4 className="font-bold text-white mt-1">Used Voltas 1.5 Ton AC</h4>
                        </div>
                         <div className="text-right">
                             <p className="text-xl font-bold text-accent">₹12,500</p>
                             <p className="text-xs text-muted-foreground">with Ramesh P.</p>
                         </div>
                    </div>
                    <div className="border-t border-border my-3"></div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <Clock className="text-primary w-5 h-5"/>
                            <div>
                                <p className="text-xs text-primary font-bold">WAITING TIMER</p>
                                <p className="font-mono font-bold text-lg text-white">{formatTime(timeLeft)}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent" asChild>
                            <Link href="/chat/123">View Deal</Link>
                        </Button>
                    </div>
                 </div>
            </CardContent>
        </Card>
    );
};

const completedDeals = [
  { id: 'GS-2026-Z8Y7X6', partner: 'Sangeeta K.', item: 'IKEA Bookshelf Sale', date: '12 Oct 2024' },
  { id: 'GS-2026-F5E4D3', partner: 'Amit Singh', item: 'Kitchen Sink Repair', date: '05 Sep 2024' },
];

const CompletedDealsList = () => (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle className="font-headline text-white text-lg">Completed Deals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {completedDeals.map(deal => (
                <div key={deal.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-border">
                    <FileText className="text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-semibold text-white">{deal.item}</p>
                        <p className="text-xs text-muted-foreground">{deal.partner} • {deal.date}</p>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="w-9 h-9" asChild>
                             <Link href="/legal-document"><Download className="w-4 h-4"/></Link>
                         </Button>
                         <Button variant="ghost" size="icon" className="w-9 h-9"><Share2 className="w-4 h-4"/></Button>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);

export function LegalVault() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    if (isUserLoading) {
        return <p>Loading...</p>;
    }
    
    if (!user) {
        // This is a protected route, redirect if not logged in.
        // We can do this here or at the page level with more advanced logic.
        useEffect(() => {
            router.push('/login');
        }, [router]);
        return null; // Render nothing while redirecting
    }

  return (
    <div className="space-y-6">
        <VerificationStatusCard />
        <ActiveAgreementCard />
        <CompletedDealsList />
    </div>
  );
}
