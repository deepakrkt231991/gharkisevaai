'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, TrendingUp, Banknote, FileText, Users, Wrench, QrCode, IndianRupee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

// Mock Data based on the new design
const totalPassiveIncome = "45,280";
const monthlyGrowth = "+12.5%";
const referralIncome = "28,400";
const referralGrowth = "8%";
const toolRentalIncome = "16,880";
const toolRentalGrowth = "15%";

const transactions = [
  {
    icon: Wrench, // Placeholder for AC Repair
    title: 'AC Repair Referral',
    date: 'Oct 24 • 14:20',
    amount: '850.00',
    status: 'PAID',
  },
  {
    icon: Wrench, // Placeholder for Drill Kit
    title: 'Drill Kit Rental',
    date: 'Oct 23 • 09:15',
    amount: '450.00',
    status: 'PENDING',
  },
  {
    icon: Wrench, // Placeholder for Interior Design
    title: 'Interior Design Lead',
    date: 'Oct 22 • 18:45',
    amount: '1,200.00',
    status: 'PAID',
  },
];


function HubHeader() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback>U</AvatarFallback>
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

function TotalIncomeCard() {
    return (
        <Card className="glass-card border-none bg-gradient-to-br from-primary/80 to-primary/50 text-primary-foreground">
            <CardContent className="p-6 space-y-4">
                <div className="text-center">
                    <p className="text-sm font-medium text-white/80">TOTAL PASSIVE INCOME</p>
                    <p className="text-5xl font-bold font-headline text-white mt-1">
                        <IndianRupee className="inline-block h-10 w-10 -mt-2" />
                        {totalPassiveIncome}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-accent">
                        <TrendingUp className="h-4 w-4" />
                        <span>{monthlyGrowth} this month</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button className="h-12 bg-white/90 text-primary hover:bg-white">
                        <Banknote className="mr-2"/>
                        Withdraw
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

function BreakdownSection() {
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Breakdown</h3>
                <Link href="#" className="text-sm font-bold text-primary">View Reports</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Users size={16} className="text-primary"/>
                            <p className="text-sm font-bold">REFERRALS</p>
                        </div>
                        <p className="text-2xl font-bold text-white">₹{referralIncome}</p>
                        <p className="text-xs font-medium text-green-400 flex items-center gap-1"><TrendingUp size={14}/> {referralGrowth} GROWTH</p>
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Wrench size={16} className="text-primary"/>
                            <p className="text-sm font-bold">TOOL RENTALS</p>
                        </div>
                        <p className="text-2xl font-bold text-white">₹{toolRentalIncome}</p>
                        <p className="text-xs font-medium text-green-400 flex items-center gap-1"><TrendingUp size={14}/> {toolRentalGrowth} GROWTH</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function CreatePosterCard() {
    return (
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
    );
}

function RecentTransactions() {
    return (
         <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline">Recent Transactions</h3>
                <Link href="#" className="text-sm font-bold text-primary">See All</Link>
            </div>
            <div className="space-y-3">
                {transactions.map((tx, index) => (
                    <Card key={index} className="glass-card">
                        <CardContent className="p-3 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <tx.icon className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white">{tx.title}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">₹{tx.amount}</p>
                                <p className={`text-xs font-bold ${tx.status === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.status}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}


export function EarningsHub() {
  return (
    <>
      <HubHeader />
      <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-24">
        <TotalIncomeCard />
        <BreakdownSection />
        <CreatePosterCard />
        <RecentTransactions />
      </main>
    </>
  );
}
