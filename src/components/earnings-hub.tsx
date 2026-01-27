
'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Transaction } from '@/lib/entities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, TrendingUp, Banknote, FileText, Users, Wrench, QrCode, IndianRupee, Loader2, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { BarChart, CartesianGrid, XAxis, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

function HubHeader() {
    const { user } = useUser();
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/150/150`} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                    <h1 className="font-headline text-xl font-bold tracking-tight">Earnings Hub</h1>
                </div>
            </div>
             <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
            </Button>
        </header>
    );
}

function TotalIncomeCard({ totalEarnings }: { totalEarnings: number }) {
    const { toast } = useToast();
    
    const handleWithdraw = () => {
        toast({
            title: "Coming Soon!",
            description: "Bank withdrawal functionality is under development."
        });
    }

    return (
        <Card className="glass-card border-none bg-gradient-to-br from-primary/80 to-primary/50 text-primary-foreground">
            <CardContent className="p-6 space-y-4">
                <div className="text-center">
                    <p className="text-sm font-medium text-white/80">TOTAL WALLET BALANCE</p>
                    <p className="text-5xl font-bold font-headline text-white mt-1">
                        <IndianRupee className="inline-block h-10 w-10 -mt-2" />
                        {totalEarnings.toFixed(2)}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-accent">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12.5% this month</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleWithdraw} className="h-12 bg-white/90 text-primary hover:bg-white">
                        <Banknote className="mr-2"/>
                        Withdraw All
                    </Button>
                    <Button variant="outline" className="h-12 border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
                        <FileText className="mr-2"/>
                        Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

const TransactionRow = ({ tx }: { tx: Transaction & {id: string} }) => {
    const { toast } = useToast();
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    
    const isPayout = tx.type === 'payout';
    const completedAt = tx.jobCompletedAt ? (tx.jobCompletedAt as any).toDate() : null;
    const oneHour = 1 * 60 * 60 * 1000;
    const isWithdrawalReady = completedAt ? (new Date().getTime() - completedAt.getTime()) > oneHour : false;
    const timeRemaining = completedAt ? Math.max(0, oneHour - (new Date().getTime() - completedAt.getTime())) : 0;
    const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));


    const handleWithdraw = () => {
        setIsWithdrawing(true);
        toast({ title: 'Initiating Withdrawal...', description: 'This is a simulation.'});
        setTimeout(() => {
            setIsWithdrawing(false);
            toast({ title: 'Success!', description: 'Amount has been transferred to your bank.', className: 'bg-green-600 text-white'});
        }, 2000);
    }
    
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
                    <p className="font-bold text-white text-lg">+ ₹{tx.amount.toFixed(2)}</p>
                    {isPayout && (
                        isWithdrawalReady ? (
                             <Button size="sm" className="h-7 mt-1 text-xs" onClick={handleWithdraw} disabled={isWithdrawing}>
                                {isWithdrawing ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : null}
                                Withdraw
                            </Button>
                        ) : (
                             <p className="text-xs text-yellow-400">Ready in ~{minutesRemaining} mins</p>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

const EarningsChart = ({ transactions }: { transactions: Transaction[] }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i));
    
    const dailyTotals = last7Days.reduce((acc, date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        acc[dateString] = { payouts: 0, referrals: 0 };
        return acc;
    }, {} as Record<string, { payouts: number, referrals: number }>);

    transactions.forEach(tx => {
        if (!tx.timestamp) return;
        const txDate = tx.timestamp.toDate();
        const dateString = format(txDate, 'yyyy-MM-dd');
        
        if (dailyTotals.hasOwnProperty(dateString)) {
            if (tx.type === 'payout') {
                dailyTotals[dateString].payouts += tx.amount;
            } else if (tx.type === 'referral_commission') {
                dailyTotals[dateString].referrals += tx.amount;
            }
        }
    });

    return Object.keys(dailyTotals).map(dateString => ({
        date: format(new Date(dateString), 'dd MMM'),
        Payouts: dailyTotals[dateString].payouts,
        'Referral Bonus': dailyTotals[dateString].referrals,
    })).reverse(); // Reverse to show oldest date first

  }, [transactions]);
  
  if (!transactions || transactions.length === 0) return null;

  return (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle className="font-headline text-white flex items-center gap-2">
                <BarChart2 />
                Earning Lifestyle
            </CardTitle>
        </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="Payouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Referral Bonus" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


export function EarningsHub() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const transactionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'transactions'), 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, user]);

    const { data: transactions, isLoading: isTransactionsLoading } = useCollection<Transaction>(transactionsQuery);

    const totalEarnings = useMemo(() => {
        if (!transactions) return 0;
        return transactions.reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions]);
    
    if (isUserLoading) {
        return (
             <div className="p-4 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
             </div>
        )
    }

  return (
    <>
      <HubHeader />
      <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-24">
        <TotalIncomeCard totalEarnings={totalEarnings} />
        
        <EarningsChart transactions={transactions || []} />
        
         <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Recent Transactions</h3>
                <Link href="#" className="text-sm font-bold text-primary">See All</Link>
            </div>
             {isTransactionsLoading && (
                 <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                 </div>
             )}
            {transactions && transactions.length > 0 ? (
                 <div className="space-y-3">
                    {transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
                </div>
            ) : !isTransactionsLoading && (
                <p className="text-muted-foreground text-center py-8">No earnings yet. Complete jobs or refer friends to start earning!</p>
            )}
        </div>
        
        <Card className="glass-card p-4 space-y-3 bg-gradient-to-br from-primary/20 to-transparent">
             <div className="flex items-center gap-2 text-accent text-xs font-bold">
                <span className="animate-pulse">✨</span>
                <span>AI MAGIC TOOL</span>
            </div>
            <h4 className="text-lg font-bold font-headline text-white">Create Referral Poster</h4>
            <p className="text-sm text-muted-foreground">One-click personalized posters with your unique QR code.</p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/promote">
                    <QrCode className="mr-2"/>
                    Generate WhatsApp Poster
                </Link>
            </Button>
        </Card>
      </main>
    </>
  );
}
