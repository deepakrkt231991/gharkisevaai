'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Plus, Send, Smile, Sparkles, Handshake, ShieldCheck, IndianRupee, FileText, Download, Info, Bot, X, Truck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDoc, useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import type { Job, User as UserEntity, Tool, Rental, Property, Product, Deal } from '@/lib/entities';
import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { confirmProductDelivery, payForShipping, shipItem, cancelDeal, raiseDispute } from '@/app/chat/[chatId]/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


type OtherUser = Partial<UserEntity> & { id: string, photoURL?: string, displayName?: string };
type ContextDoc = (Job | Tool | Property | Rental | Product | Deal) & { id: string };

const AiSuggestions = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm font-bold text-white flex-shrink-0">AI</p>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">Is the price negotiable?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">Can you deliver it?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">I'll pay the advance</Button>
    </div>
);

const InvoiceCard = ({ job, contextType }: { job: Job, contextType: string }) => {
    const { toast } = useToast();

    if (!job || contextType !== 'job' || job.status !== 'completed') {
        return null;
    }

    const handleDownload = () => {
        toast({
            title: "Downloading Invoice...",
            description: "In a real app, a PDF would be generated and downloaded.",
        });
    }

    const finalCost = job.final_cost || 0;
    const platformFee = job.platformFee || 0;
    const gst = job.gst || 0;
    const totalPaid = finalCost;

    return (
        <Card className="glass-card border-l-4 border-l-green-500">
            <CardHeader className="flex-row items-center justify-between p-4">
                <CardTitle className="flex items-center gap-2 font-headline text-white">
                    <FileText size={20}/>
                    Final Invoice
                </CardTitle>
                <Badge className="bg-green-600/80 border-green-500 text-white">PAID</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm p-4">
                 <div className="flex justify-between">
                    <p className="text-muted-foreground">Final Service Cost</p>
                    <p className="font-medium text-white">₹{finalCost.toFixed(2)}</p>
                </div>
                <div className="pl-4">
                    <div className="flex justify-between text-xs">
                        <p className="text-muted-foreground">Worker Payout</p>
                        <p className="font-medium text-white">₹{(job.workerPayout || 0).toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between text-xs">
                        <p className="text-muted-foreground">Platform Fee (incl. GST)</p>
                        <p className="font-medium text-white">- ₹{platformFee.toFixed(2)}</p>
                    </div>
                </div>
                <Separator className="my-2 bg-border/50"/>
                <div className="flex justify-between font-bold">
                    <p className="text-white">Total Paid by Customer</p>
                    <p className="text-accent text-lg">₹{totalPaid.toFixed(2)}</p>
                </div>
                 <div className="text-xs text-muted-foreground pt-2">
                    <p>Platform Fee of ₹{platformFee.toFixed(2)} includes ₹{gst.toFixed(2)} GST (18%).</p>
                    <p>Thank you for using Ghar Ki Seva!</p>
                </div>
            </CardContent>
            <CardFooter className="p-4">
                 <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2" size={16}/>
                    Download Invoice
                </Button>
            </CardFooter>
        </Card>
    );
};

const ProductDealFlowControls = ({ deal }: { deal: Deal }) => {
    const { user } = useUser();
    const { toast } = useToast();
    const [trackingNumber, setTrackingNumber] = useState('');

    if (!user || !deal) return null;

    const isBuyer = user.uid === deal.buyerId;
    const isSeller = user.uid === deal.sellerId;

    const handleAction = async (action: (dealId: string, ...args: any[]) => Promise<{success: boolean; message: string}>, ...args: any[]) => {
        toast({ title: 'Processing...' });
        const result = await action(deal.dealId, ...args);
        if (result.success) {
            toast({ title: 'Success!', description: result.message, className: 'bg-green-600 text-white' });
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };
    
    return (
        <Card className="glass-card border-l-4 border-l-primary/80">
            <CardHeader className="p-4 flex-row items-center justify-between">
                 <CardTitle className="flex items-center gap-2 font-headline text-white">
                    <Handshake size={20}/>
                    Manage Deal
                </CardTitle>
                <Badge variant="outline" className={cn(
                    "text-yellow-300 border-yellow-400/50 bg-yellow-900/40",
                    deal.status === 'completed' && "text-green-300 border-green-400/50 bg-green-900/40",
                    deal.status === 'disputed' && "text-red-300 border-red-400/50 bg-red-900/40",
                    deal.status === 'cancelled' && "text-gray-300 border-gray-400/50 bg-gray-900/40",
                )}>
                    {deal.status?.replace('_', ' ').toUpperCase()}
                </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                 {deal.status === 'disputed' && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Dispute Active</AlertTitle>
                        <AlertDescription>An admin is reviewing this deal and will contact you shortly. Please do not make any further payments.</AlertDescription>
                    </Alert>
                )}
                {isBuyer && deal.status === 'reserved' && (
                    <Button onClick={() => handleAction(payForShipping)} className="w-full h-12">Pay 95% for Courier Delivery</Button>
                )}
                {isSeller && deal.status === 'awaiting_shipment' && (
                    <div className="space-y-2">
                         <div className="flex gap-2">
                             <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter Courier Tracking #" className="bg-input"/>
                             <Button onClick={() => handleAction(shipItem, trackingNumber)} disabled={!trackingNumber}><Truck size={16}/></Button>
                         </div>
                         <p className="text-xs text-muted-foreground">Provide tracking number to release the 95% payment to your wallet.</p>
                    </div>
                )}
                 {isBuyer && deal.status === 'shipped' && (
                     <div className="space-y-3">
                        <Button onClick={() => handleAction(confirmProductDelivery)} className="w-full h-12 bg-green-600 hover:bg-green-700">Confirm Product Received</Button>
                        <Button onClick={() => handleAction(raiseDispute)} variant="destructive" className="w-full">
                            <AlertTriangle className="mr-2 h-4 w-4" /> I have an issue (Raise Dispute)
                        </Button>
                    </div>
                )}
                 {isSeller && deal.status === 'shipped' && (
                     <Button onClick={() => handleAction(raiseDispute)} variant="destructive" className="w-full">
                        <AlertTriangle className="mr-2 h-4 w-4" /> Raise Dispute (e.g. Buyer not confirming)
                    </Button>
                )}
                {(isBuyer || isSeller) && ['reserved', 'awaiting_shipment_payment'].includes(deal.status) && (
                    <Button onClick={() => handleAction(cancelDeal)} variant="destructive" className="w-full h-12">Cancel Deal &amp; Refund Advance</Button>
                )}
                <div className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-black/20">
                    <Bot size={20} className="flex-shrink-0 mt-0.5 text-primary"/>
                    <p>AI is monitoring this transaction. In case of no delivery within 10 days of shipment, the amount will be auto-refunded to the buyer.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export function ChatInterface({ chatId }: { chatId: string }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
    const [contextType, setContextType] = useState<'job' | 'tool' | 'property' | 'product' | 'deal' | 'unknown'>('unknown');
    const [contextDoc, setContextDoc] = useState<ContextDoc | null>(null);
    const [contextLoading, setContextLoading] = useState(true);

    // Parse chatId to determine context
    useEffect(() => {
        if (!chatId) return;
        setContextLoading(true);
        const [type] = chatId.split('-');
        if (['job', 'tool', 'property', 'product', 'deal'].includes(type)) {
            setContextType(type as any);
        } else {
            setContextType('unknown');
        }
        setContextLoading(false);
    }, [chatId]);

    // Fetch context document (Job, Tool, Property, Product, Deal)
    const contextDocRef = useMemoFirebase(() => {
        if (!firestore || contextLoading || contextType === 'unknown') return null;
        const id = chatId.split('-').slice(1).join('-');
        let collectionName = contextType + 's';
        if (contextType === 'property') collectionName = 'properties';

        return doc(firestore, collectionName, id);
    }, [firestore, chatId, contextType, contextLoading]);

    const { data: fetchedContextDoc, isLoading: isContextDocLoading } = useDoc<ContextDoc>(contextDocRef);
    
    useEffect(() => {
        setContextDoc(fetchedContextDoc);
    },[fetchedContextDoc])
    
    // Determine the "other user" from the context document
    const otherUserId = useMemoFirebase(() => {
        if (!contextDoc || !user) return null;
        switch(contextType) {
            case 'job': return (contextDoc as Job).workerId;
            case 'deal':
                return user.uid === (contextDoc as Deal).buyerId ? (contextDoc as Deal).sellerId : (contextDoc as Deal).buyerId;
            case 'tool':
            case 'property':
            case 'product':
                const ownerId = (contextDoc as any).ownerId;
                // Pre-deal chat, so we need a buyer. This is a simplification.
                // In a real app, you might create a chat document with both participants.
                return user.uid === ownerId ? null : ownerId; 
            default: return null;
        }
    }, [contextDoc, user, contextType]);

    const otherUserRef = useMemoFirebase(() => {
        if (!firestore || !otherUserId) return null;
        return doc(firestore, 'users', otherUserId);
    }, [firestore, otherUserId]);
    const { data: fetchedOtherUser, isLoading: isOtherUserLoading } = useDoc<UserEntity>(otherUserRef);

    useEffect(() => {
        if (fetchedOtherUser) {
            setOtherUser(fetchedOtherUser as OtherUser);
        }
    }, [fetchedOtherUser]);

    const initialMessages = [
        { id: 1, sender: otherUserId || 'other', text: "Hello! I'm interested in this. Is it available?", time: '10:14 AM' },
        { id: 2, sender: user?.uid || 'user', text: "Yes, it is! When would you like to pick it up?", time: '10:15 AM' },
    ];
    
    const isLoading = isUserLoading || isContextDocLoading || (otherUserId && isOtherUserLoading) || contextLoading;

     if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-background">
                 <header className="p-4 border-b border-border space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </header>
                 <main className="flex-1 p-4 space-y-4">
                    <Skeleton className="h-16 w-2/3 self-start" />
                    <Skeleton className="h-16 w-2/3 self-end" />
                </main>
                <footer className="p-4 border-t border-border">
                    <Skeleton className="h-12 w-full" />
                </footer>
            </div>
        )
    }

    const getOtherUserTitle = () => {
        if (contextType === 'job') return (otherUser as UserEntity)?.skills?.[0] || 'Worker';
        if (contextType === 'deal') return user?.uid === (contextDoc as Deal)?.buyerId ? 'Seller' : 'Buyer';
        return 'User';
    }

    const getContextTitle = () => {
         switch(contextType) {
            case 'job': return (contextDoc as Job)?.ai_diagnosis || 'Service Request';
            case 'deal': return (contextDoc as Deal)?.productName || 'Product Deal';
            case 'tool': return (contextDoc as Tool)?.name || 'Tool Rental';
            case 'property': return (contextDoc as Property)?.title || 'Property Inquiry';
            case 'product': return (contextDoc as Product)?.name || 'Product Inquiry';
            default: return 'Conversation';
        }
    }
    
    return (
        <div className="flex flex-col h-full bg-background text-white">
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="-ml-2" asChild>
                        <Link href="/marketplace"><ArrowLeft/></Link>
                    </Button>
                    <Avatar>
                        <AvatarImage src={otherUser?.photoURL} />
                        <AvatarFallback>{otherUser?.displayName?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-white">{otherUser?.displayName || 'User'} - {getOtherUserTitle()}</h2>
                        <div className="flex items-center gap-1.5">
                             <p className="text-xs text-muted-foreground">{getContextTitle()}</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <Phone className="w-6 h-6 text-white"/>
                </Button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {contextType === 'deal' && <ProductDealFlowControls deal={contextDoc as Deal} />}
                {contextType === 'job' && <InvoiceCard job={contextDoc as Job} contextType={contextType} />}
                
                <div className="text-center text-xs text-muted-foreground font-medium">TODAY</div>
                {initialMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === user?.uid ? 'items-end' : 'items-start'}`}>
                        {msg.sender !== user?.uid && <p className="text-sm text-muted-foreground mb-1">{otherUser?.displayName}</p>}
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === user?.uid ? 'bg-primary text-white rounded-br-none' : 'bg-card rounded-bl-none'}`}>
                           <p>{msg.text}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</p>
                    </div>
                ))}
            </main>

            <footer className="sticky bottom-0 z-10 p-4 bg-background/80 backdrop-blur-md border-t border-border space-y-3">
                 <AiSuggestions />
                 <div className="flex items-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-card">
                        <Plus className="w-6 h-6"/>
                    </Button>
                    <div className="relative flex-1">
                        <Input placeholder="Type a message..." className="pr-12 bg-card h-12 rounded-full"/>
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10">
                            <Smile className="w-6 h-6 text-muted-foreground"/>
                        </Button>
                    </div>
                     <Button size="icon" variant="default" className="rounded-full h-12 w-12 bg-primary">
                        <Send className="w-6 h-6"/>
                    </Button>
                 </div>
            </footer>
        </div>
    );
}
    