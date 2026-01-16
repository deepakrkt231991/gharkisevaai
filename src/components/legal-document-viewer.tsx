'use client';

import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Shield, User, Package, IndianRupee, Info, LogIn, FileLock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function LegalDocumentViewer() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const dealId = `GS-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const handleDownload = () => {
        toast({
            title: "Download Initiated",
            description: "Your document is being prepared. In a real app, this would download a PDF.",
            className: "bg-primary text-white border-primary"
        });
    };

    if (isUserLoading) {
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
                             <Skeleton className="h-12 w-full" />
                        </div>
                        <Separator/>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Skeleton className="h-14 w-full" />
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
        <div className="space-y-4">
            <Card className="glass-card overflow-hidden">
                <CardHeader className="bg-black/20 p-4">
                    <p className="text-sm font-bold text-primary">GRIHSEVA AI - DIGITAL SECURITY AGREEMENT</p>
                    <div className="flex justify-between items-center">
                         <p className="text-xs text-muted-foreground font-mono">Deal ID: {dealId}</p>
                         <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-900/30">
                            <Shield className="mr-2 h-3 w-3"/>Legally Verified
                         </Badge>
                    </div>
                     <p className="text-xs text-muted-foreground">{date}</p>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {/* 1. Parties */}
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><User size={20}/>Parties (पक्ष)</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 bg-black/10 p-2 rounded-lg">
                                <p className="text-xs font-bold uppercase text-muted-foreground w-16">SELLER</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=seller" />
                                        <AvatarFallback>S</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-white">Ramesh Patel</span>
                                </div>
                            </div>
                             <div className="flex items-center gap-3 bg-black/10 p-2 rounded-lg">
                                 <p className="text-xs font-bold uppercase text-muted-foreground w-16">BUYER</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} />
                                        <AvatarFallback>{user.displayName?.charAt(0) || 'B'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-white">{user.displayName || 'Priya Singh'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 2. Item/Service Details */}
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><Package size={20}/>Item/Service Details (विवरण)</h4>
                        <div className="bg-black/10 p-3 rounded-lg space-y-1">
                             <p className="text-sm text-muted-foreground">Object:</p>
                             <p className="font-semibold text-white">Used Voltas 1.5 Ton AC</p>
                             <p className="text-sm text-muted-foreground pt-2">AI Condition Report:</p>
                             <p className="font-semibold text-white">90% Working (AI Verified Images Attached)</p>
                        </div>
                    </div>

                    <Separator />

                     {/* 3. Payment Terms */}
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><IndianRupee size={20}/>Payment Terms (भुगतान शर्तें)</h4>
                        <div className="bg-black/10 p-3 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">Final Price:</p>
                                <p className="font-bold text-lg text-accent">₹ 12,500.00</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Refund Policy:</p>
                                <p className="text-sm text-white">अगर सामान/रूम 24 घंटे के Waiting Time के अंदर नहीं मिला, तो बायर को Instant Refund मिलेगा।</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Security Logic:</p>
                                <p className="text-sm text-white"> पैसा तब तक सेलर को नहीं मिलेगा जब तक बायर ऐप में 'Done' बटन न दबा दे।</p>
                            </div>
                        </div>
                    </div>

                     <Separator />

                     {/* 4. Commission Clause */}
                    <div>
                         <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-2"><Info size={20}/>Commission Clause</h4>
                         <p className="text-sm text-muted-foreground bg-black/10 p-3 rounded-lg">
                            इस डील का 0.05% हिस्सा रेफरल पार्टनर को क्रेडिट किया गया है।
                         </p>
                    </div>

                </CardContent>
                <CardFooter className="bg-black/20 p-4">
                     <p className="text-xs text-center text-muted-foreground w-full">Digitally Signed via GrihSeva AI Security Vault</p>
                </CardFooter>
            </Card>

            <Button onClick={handleDownload} className="w-full h-14 bg-primary text-white">
                <Download className="mr-2" />
                Download Agreement
            </Button>
        </div>
    );
}