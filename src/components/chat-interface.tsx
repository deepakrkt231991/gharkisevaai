
'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Plus, Send, Smile, Sparkles, Handshake, ShieldCheck, IndianRupee, FileText, Download, Info, Bot, X, Truck, AlertTriangle, CheckCircle, Shield, HelpCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDoc, useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import type { Job, User as UserEntity, Tool, Rental, Property, Product, Deal } from '@/lib/entities';
import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { confirmProductDelivery, payForShipping, shipItem, cancelDeal, raiseDispute, completeToolRental } from '@/app/chat/[chatId]/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 fill-current"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/></svg>
);


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

const WarrantyCertificateCard = ({ job, worker }: { job: Job, worker: OtherUser | null }) => {
    if (!job || job.status !== 'completed') {
        return null;
    }

    const completionDate = job.completedAt ? (job.completedAt as any).toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';

    return (
        <Card className="glass-card border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-900/30 to-background">
            <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 font-headline text-yellow-300">
                    <ShieldCheck size={24}/>
                    CERTIFICATE OF ASSURED SERVICE
                </CardTitle>
                <CardDescription className="text-yellow-400/80">
                    Order ID: #GKS-{job.id.substring(0, 6).toUpperCase()} | Date: {completionDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
                 <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Service</p>
                    <p className="font-semibold text-white">{job.ai_diagnosis || 'Service'}</p>
                </div>
                 <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Worker</p>
                    <p className="font-semibold text-white flex items-center gap-2">{worker?.displayName || 'N/A'} <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-900/30 text-xs">AI Verified ID</Badge></p>
                </div>
                 <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Warranty Period</p>
                    <p className="font-semibold text-white">15 days (Labor & Finish)</p>
                </div>
                
                <Separator className="bg-yellow-400/20 my-4"/>

                <div>
                    <h4 className="font-bold text-white mb-2">Covered Benefits:</h4>
                    <ul className="space-y-2 text-white/90">
                        <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0"/>
                            <span><strong>Free Fix:</strong> If any defect appears in the work within 15 days, Ghar Ki Seva will get it fixed for free.</span>
                        </li>
                        <li className="flex items-start gap-2">
                             <CheckCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0"/>
                            <span><strong>Verified Professional:</strong> This work was performed by one of our top-rated and certified workers.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0"/>
                            <span><strong>Payment Protection:</strong> Your full payment was securely transferred through the Ghar Ki Seva 'Safe Vault'.</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="bg-black/20 p-3">
                 <p className="text-xs text-center text-yellow-500/80 w-full">
                    Note: This warranty is only valid as the payment and booking were made through the Ghar Ki Seva app.
                 </p>
            </CardFooter>
        </Card>
    );
};

const InvoiceCard = ({ job, contextType }: { job: Job | null, contextType: string }) => {
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
                    <Button onClick={() => handleAction(payForShipping)} className="w-full h-12">Pay 93% for Courier Delivery</Button>
                )}
                {isSeller && deal.status === 'awaiting_shipment' && (
                    <div className="space-y-2">
                         <div className="flex gap-2">
                             <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter Courier Tracking #" className="bg-input"/>
                             <Button onClick={() => handleAction(shipItem, trackingNumber)} disabled={!trackingNumber}><Truck size={16}/></Button>
                         </div>
                         <p className="text-xs text-muted-foreground">Provide tracking number to release the 93% payment to your wallet.</p>
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

const ToolRentalFlowControls = ({ rental }: { rental: Rental }) => {
    const { user } = useUser();
    const { toast } = useToast();

    if (!user || !rental) return null;

    const isRenter = user.uid === rental.renterId;
    const isOwner = user.uid === rental.ownerId;

    const handleAction = async (action: (rentalId: string) => Promise<{success: boolean; message: string}>) => {
        toast({ title: 'Processing...' });
        const result = await action(rental.rentalId);
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
                    <Wrench size={20}/>
                    Manage Tool Rental
                </CardTitle>
                <Badge variant="outline" className={cn(
                    "text-yellow-300 border-yellow-400/50 bg-yellow-900/40",
                    rental.status === 'completed' && "text-green-300 border-green-400/50 bg-green-900/40",
                    rental.status === 'disputed' && "text-red-300 border-red-400/50 bg-red-900/40",
                    rental.status === 'cancelled' && "text-gray-300 border-gray-400/50 bg-gray-900/40",
                )}>
                    {rental.status?.replace('_', ' ').toUpperCase()}
                </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {isRenter && rental.status === 'active' && (
                    <Button onClick={() => handleAction(completeToolRental)} className="w-full h-12 bg-green-600 hover:bg-green-700">Confirm Tool Returned & End Rental</Button>
                )}
                {isOwner && rental.status === 'active' && (
                    <p className="text-sm text-muted-foreground text-center">Waiting for renter to confirm tool return to end the rental period.</p>
                )}
                {rental.status === 'completed' && <p className="text-sm text-green-400 text-center">This rental has been completed.</p>}
                <div className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-black/20">
                    <Bot size={20} className="flex-shrink-0 mt-0.5 text-primary"/>
                    <p>Upon completion, the rental fee (minus 7% platform fee) will be transferred to the owner's wallet.</p>
                </div>
            </CardContent>
        </Card>
    );
};

const PaymentSafetyNotice = () => (
    <div className="flex items-start gap-3 text-xs text-muted-foreground p-3 rounded-lg bg-black/20 border border-primary/30">
        <Shield size={28} className="flex-shrink-0 mt-0.5 text-primary"/>
        <div>
            <p className="font-bold text-white">Always pay through the app.</p>
            <p>Paying outside the app voids your 15-day service warranty and 100% refund protection. Our AI monitors this chat for any off-platform payment requests.</p>
        </div>
    </div>
);

const AiHelpDialog = ({ open, onOpenChange, deal, userRole }: { open: boolean, onOpenChange: (open: boolean) => void, deal: Deal | null, userRole: 'buyer' | 'seller' | 'none' }) => {
    if (!deal) return null;

    let title = "AI Assistant";
    let description = "How can I help you with this deal?";
    let suggestion = "Our support team is available 24/7.";

    switch (deal.status) {
        case 'reserved':
            if (userRole === 'buyer') {
                title = "Next Step: Final Payment";
                description = "You have successfully reserved the item by paying the 7% advance. To proceed, you need to pay the remaining 93% for delivery.";
                suggestion = "Click 'Pay for Shipping' in the 'Manage Deal' card to complete the payment. The amount is held securely until you confirm delivery.";
            } else {
                title = "Item Reserved!";
                description = "The buyer has paid the 7% advance and this item is now reserved for them for the next 10 days.";
                suggestion = "Please wait for the buyer to make the final payment. Once they do, you will be notified to ship the item.";
            }
            break;
        case 'awaiting_shipment':
            if (userRole === 'seller') {
                title = "Action Required: Ship Item";
                description = "The buyer has paid the full amount. Please pack the item securely and ship it to the buyer's address.";
                suggestion = "Once shipped, enter the courier tracking number in the 'Manage Deal' card to release the payment to your wallet.";
            } else {
                title = "Awaiting Shipment";
                description = "You have paid the full amount. The seller has been notified to ship your item.";
                suggestion = "You will receive a notification with the tracking number as soon as the seller ships it.";
            }
            break;
        case 'shipped':
             if (userRole === 'buyer') {
                title = "Confirm Delivery";
                description = "Your item has been shipped! Once you receive it and are satisfied with the condition, please confirm the delivery.";
                suggestion = "Click the 'Confirm Product Received' button in the 'Manage Deal' card. This will complete the deal and transfer the payment to the seller.";
            } else {
                 title = "Item Shipped";
                description = "You have marked the item as shipped. We are now waiting for the buyer to confirm that they have received it.";
                suggestion = "The payment will be released to your wallet as soon as the buyer confirms delivery.";
            }
            break;
        case 'disputed':
            title = "Dispute in Review";
            description = "This deal is currently under review by our admin team due to a dispute. All payments are held securely in the Safe Vault.";
            suggestion = "An admin will contact both parties via this chat shortly to mediate and resolve the issue. Please do not make any further transactions related to this deal.";
            break;
        default:
            title = "Deal Status";
            description = `The current status of this deal is: ${deal.status?.replace('_', ' ').toUpperCase()}.`;
            suggestion = "If you have any questions, feel free to ask the other party or raise a dispute if you encounter any issues.";
            break;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-white flex items-center gap-2">
                        <Bot /> {title}
                    </DialogTitle>
                    <DialogDescription className="pt-4 text-muted-foreground space-y-4">
                       <p>{description}</p>
                       <Alert className="bg-primary/10 border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-white">Suggestion</AlertTitle>
                            <AlertDescription className="text-primary/90">
                                {suggestion}
                            </AlertDescription>
                        </Alert>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}


export function ChatInterface({ chatId }: { chatId: string }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
    const [contextType, setContextType] = useState<'job' | 'tool' | 'property' | 'product' | 'deal' | 'rental' | 'unknown'>('unknown');
    const [contextDoc, setContextDoc] = useState<ContextDoc | null>(null);
    const [contextLoading, setContextLoading] = useState(true);
    const [showAiHelpDialog, setShowAiHelpDialog] = useState(false);


    // Parse chatId to determine context
    useEffect(() => {
        if (!chatId) return;
        setContextLoading(true);
        const [type] = chatId.split('-');
        if (['job', 'tool', 'property', 'product', 'deal', 'rental'].includes(type)) {
            setContextType(type as any);
        } else {
            setContextType('unknown');
        }
        setContextLoading(false);
    }, [chatId]);

    // Fetch context document (Job, Tool, Property, Product, Deal, Rental)
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
            case 'rental':
                 return user.uid === (contextDoc as Rental).renterId ? (contextDoc as Rental).ownerId : (contextDoc as Rental).renterId;
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
        if (contextType === 'rental') return user?.uid === (contextDoc as Rental)?.renterId ? 'Tool Owner' : 'Renter';
        return 'User';
    }

    const getContextTitle = () => {
         switch(contextType) {
            case 'job': return (contextDoc as Job)?.ai_diagnosis || 'Service Request';
            case 'deal': return (contextDoc as Deal)?.productName || 'Product Deal';
            case 'rental': return (contextDoc as Tool)?.name || 'Tool Rental';
            case 'tool': return (contextDoc as Tool)?.name || 'Tool Rental';
            case 'property': return (contextDoc as Property)?.title || 'Property Inquiry';
            case 'product': return (contextDoc as Product)?.name || 'Product Inquiry';
            default: return 'Conversation';
        }
    }
    
    const whatsAppNumber = otherUser?.phone || '910000000000';
    const whatsAppMessage = `Hi, I'm contacting you from Ghar Ki Seva regarding: ${getContextTitle()}`;

    return (
        <div className="flex flex-col h-full bg-background text-white">
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="-ml-2" asChild>
                        <Link href="/marketplace"><ArrowLeft/></Link>
                    </Button>
                    <Avatar>
                        <AvatarImage src={otherUser?.photoURL || `https://picsum.photos/seed/${otherUser?.id}/150/150`} />
                        <AvatarFallback>{otherUser?.displayName?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-white">{otherUser?.displayName || 'User'} - {getOtherUserTitle()}</h2>
                        <div className="flex items-center gap-1.5">
                             <p className="text-xs text-muted-foreground">{getContextTitle()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" asChild>
                        <a href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Phone className="w-6 h-6 text-white"/>
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {contextType === 'deal' && <ProductDealFlowControls deal={contextDoc as Deal} />}
                {contextType === 'rental' && <ToolRentalFlowControls rental={contextDoc as Rental} />}
                {contextType === 'job' && <InvoiceCard job={contextDoc as Job | null} contextType={contextType} />}
                {contextType === 'job' && <WarrantyCertificateCard job={contextDoc as Job} worker={otherUser} />}
                
                <PaymentSafetyNotice />

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
             <AiHelpDialog
                open={showAiHelpDialog}
                onOpenChange={setShowAiHelpDialog}
                deal={contextType === 'deal' ? (contextDoc as Deal) : null}
                userRole={user?.uid === (contextDoc as Deal)?.buyerId ? 'buyer' : user?.uid === (contextDoc as Deal)?.sellerId ? 'seller' : 'none'}
            />
        </div>
    );
}
