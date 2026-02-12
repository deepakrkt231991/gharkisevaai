
'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import type { Transaction, Worker } from '@/lib/entities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, TrendingUp, Banknote, FileText, Users, Wrench, IndianRupee, Star, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';

function HubHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/150/150`} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'W'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                    <h1 className="font-headline text-xl font-bold tracking-tight">Partner Dashboard</h1>
                </div>
            </div>
             <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
            </Button>
        </header>
    );
}

const TransactionRow = ({ tx }: { tx: Transaction & {id: string} }) => {
    const isPayout = tx.type === 'payout';
    return (
         <Card className="glass-card">
            <CardContent className="p-3 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    {isPayout ? <Wrench className="text-primary" /> : <Users className="text-primary" />}
                </div>
                <div className="flex-1">
                    <p className="font-bold text-white capitalize">{tx.type.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">Job ID: {tx.sourceJobId?.substring(0, 6)}...</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-400 text-lg">+ ₹{tx.amount.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
    );
}


export function WorkerDashboard() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const workerRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'workers', user.uid);
    }, [firestore, user?.uid]);
    const { data: workerProfile, isLoading: isWorkerLoading } = useDoc<Worker>(workerRef);

    const transactionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'transactions'), 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, user]);

    const { data: transactions, isLoading: isTransactionsLoading } = useCollection<Transaction>(transactionsQuery);

    const { totalEarnings, smartScore } = useMemo(() => {
        if (!transactions || !workerProfile) return { totalEarnings: 0, smartScore: 0 };
        const earnings = transactions.reduce((sum, tx) => (tx.type === 'payout' || tx.type === 'referral_commission' ? sum + tx.amount : sum), 0);
        
        // Smart Score Logic
        const ratingScore = (workerProfile?.rating || 0) * 20; // Max 100
        const jobsScore = Math.min(100, (workerProfile?.successfulOrders || 0) * 2); // 50 jobs = 100 score
        const verificationScore = workerProfile?.isVerified ? 100 : 0;
        
        const score = (ratingScore * 0.5) + (jobsScore * 0.3) + (verificationScore * 0.2);

        return { totalEarnings: earnings, smartScore: Math.round(score) };
    }, [transactions, workerProfile]);
    
    if (isUserLoading || isWorkerLoading) {
        return (
             <div className="p-4 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
             </div>
        )
    }

  return (
    <>
      <HubHeader />
      <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-24">
         <Card className="glass-card border-none bg-gradient-to-br from-primary/80 to-primary/50 text-primary-foreground">
            <CardContent className="p-6 space-y-4 text-center">
                <p className="text-sm font-medium text-white/80">TOTAL EARNINGS</p>
                <p className="text-5xl font-bold font-headline text-white mt-1">
                    <IndianRupee className="inline-block h-10 w-10 -mt-2" />
                    {totalEarnings.toFixed(2)}
                </p>
                <Button variant="outline" className="h-12 border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <FileText className="mr-2"/>
                    Request Payout
                </Button>
            </CardContent>
        </Card>

        <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-white">Your Smart Score</h3>
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-border"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" strokeWidth="3" />
                            <path
                                className="text-accent"
                                strokeDasharray={`${smartScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{smartScore}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">High score gets you promoted in search results for more jobs.</p>
                        <p className="text-xs text-accent font-bold mt-1">Factors: Rating, Jobs Done, Verification</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        
         <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Recent Earnings</h3>
            </div>
             {isTransactionsLoading && (
                 <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                 </div>
             )}
            {transactions && transactions.length > 0 ? (
                 <div className="space-y-3">
                    {transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
                </div>
            ) : !isTransactionsLoading && (
                <p className="text-muted-foreground text-center py-8">No earnings yet. Complete jobs to see your income here.</p>
            )}
        </div>
        
      </main>
    </>
  );
}
