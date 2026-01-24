'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { User as UserEntity, Transaction } from '@/lib/entities';
import { useDoc } from '@/firebase/firestore/use-doc';

import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function UserStats() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    // 1. Fetch user's profile data for completion score
    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserEntity>(userDocRef);

    // 2. Fetch user's transactions for earnings/savings
    const transactionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'transactions'), where('userId', '==', user.uid));
    }, [firestore, user]);
    const { data: transactions, isLoading: isTransactionsLoading } = useCollection<Transaction>(transactionsQuery);

    const { savings, smartScore } = useMemo(() => {
        if (isUserLoading || !userProfile || !transactions) {
            return { savings: 0, smartScore: 0 };
        }

        // --- Earnings/Savings Calculation (30%) ---
        const totalSavings = transactions.reduce((acc, tx) => {
            if (tx.type === 'payout' || tx.type === 'referral_commission') {
                return acc + tx.amount;
            }
            return acc;
        }, 0);
        // Normalize savings score (e.g., score of 100 for >= ₹10,000 savings)
        const savingsScore = Math.min(100, (totalSavings / 10000) * 100);

        // --- Profile Completion Calculation (30%) ---
        let completedFields = 0;
        const totalFields = 3; // name, phone, address
        if (userProfile.name) completedFields++;
        if (userProfile.phone) completedFields++;
        if (userProfile.address) completedFields++;
        const profileScore = (completedFields / totalFields) * 100;

        // --- Activity Score (40%) - SIMULATED ---
        // In a real app, this data would come from a backend that tracks user activity.
        // We simulate it here for demonstration. A cron job would update this value periodically.
        const simulatedActivityScore = 75; // Placeholder value (0-100)

        // --- Final Smart Score Calculation ---
        const finalSmartScore = 
            (simulatedActivityScore * 0.40) +
            (profileScore * 0.30) +
            (savingsScore * 0.30);

        return {
            savings: totalSavings,
            smartScore: Math.round(finalSmartScore)
        };

    }, [userProfile, transactions, isUserLoading]);

    const isLoading = isUserLoading || isProfileLoading || isTransactionsLoading;

    if (isLoading) {
        return (
            <Card className="bg-card/70">
                <CardContent className="p-4 grid grid-cols-3 divide-x divide-border">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="text-center px-2 space-y-1">
                            <Skeleton className="h-3 w-12 mx-auto" />
                            <Skeleton className="h-5 w-16 mx-auto" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-card/70">
            <CardContent className="p-4 grid grid-cols-3 divide-x divide-border">
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">SAVINGS</p>
                    <p className="text-xl font-bold text-foreground">₹{savings.toLocaleString('en-IN')}</p>
                </div>
                <Link href="/chat/123" className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">ACTIVE TASKS</p>
                    {/* This is a static value for now */}
                    <p className="text-xl font-bold text-foreground">3</p>
                </Link>
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">SMART SCORE</p>
                    <p className="text-xl font-bold text-accent">{smartScore}%</p>
                </div>
            </CardContent>
        </Card>
    );
}