'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Plus, Send, Smile, Sparkles, Handshake, ShieldCheck, IndianRupee, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDoc, useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import type { Job, User as UserEntity, Tool, Rental, Property } from '@/lib/entities';
import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';


type OtherUser = Partial<UserEntity> & { id: string, photoURL?: string, displayName?: string };
type ContextDoc = (Job | Tool | Property | Rental) & { id: string };

const AiSuggestions = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm font-bold text-white flex-shrink-0">AI</p>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">When will you arrive?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">Is the price fixed?</Button>
        <Button variant="secondary" size="sm" className="rounded-full bg-card h-8 whitespace-nowrap">I'll send a photo</Button>
    </div>
);

const InvoiceCard = ({ job, contextType }: { job: Job, contextType: string }) => {
    const { toast } = useToast();

    if (contextType !== 'job' || job.status !== 'completed') {
        return null;
    }

    const handleDownload = () => {
        toast({
            title: "Downloading Invoice...",
            description: "In a real app, a PDF would be generated and downloaded.",
        });
        // In a real app, you would generate a PDF here.
    }

    const finalCost = job.final_cost || 0;
    const platformFee = job.platformFee || 0;
    const gst = job.gst || 0;
    const totalPaid = finalCost; // Customer pays the final agreed cost.

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


const DealFlowControls = ({ context, docId, contextType }: { context: ContextDoc | null, docId: string, contextType: 'job' | 'tool' | 'property' | 'unknown' }) => {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleUpdateRequest = async (status: string) => {
        if (!firestore) return;
        const rentalRef = doc(firestore, 'rentals', docId);
        try {
            await updateDoc(rentalRef, { status: status });
            toast({ title: 'Success', description: `Rental status updated to ${status}` });
        } catch (e) {
            // If doc doesn't exist, create it
            if ((e as any).code === 'not-found' && context) {
                 await addDoc(collection(firestore, 'rentals'), { 
                    rentalId: docId,
                    toolId: (context as Tool).toolId,
                    renterId: user?.uid,
                    ownerId: (context as Tool).ownerId,
                    startDate: serverTimestamp(),
                    status: status,
                 });
                 toast({ title: 'Success', description: `Rental request sent!` });
            } else {
                 toast({ title: 'Error', description: 'Could not update status.', variant: 'destructive' });
            }
        }
    }


    if (contextType !== 'tool' || !context || !user) return null;
    
    const rentalData = context as Rental; // could also be a Tool
    const isOwner = user.uid === (rentalData as any).ownerId;
    const isRenter = user.uid === (rentalData as any).renterId;

    const status = rentalData.status || 'requested';

    return (
        <Card className="glass-card">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <Handshake className="text-primary"/>
                        <div>
                             <h4 className="font-bold text-white">Manage Deal</h4>
                             <p className="text-xs text-muted-foreground">Status: <span className="font-bold text-yellow-400">{status.replace('_', ' ').toUpperCase()}</span></p>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rent</p>
                        <p className="font-bold text-accent text-lg">₹{(context as any).rental_price_per_day}/day</p>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                    {/* Renter's perspective */}
                    {!isOwner && status === 'requested' && <Button onClick={() => handleUpdateRequest('payment_pending')}>Pay Deposit: ₹{(context as any).deposit}</Button>}
                    
                    {/* Owner's perspective */}
                    {isOwner && status === 'requested' && <Button onClick={() => handleUpdateRequest('accepted')}>Accept Request</Button>}
                </div>
            </CardContent>
        </Card>
    )
}

export function ChatInterface({ chatId }: { chatId: string }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
    const [contextType, setContextType] = useState<'job' | 'tool' | 'property' | 'unknown'>('unknown');
    const [contextDoc, setContextDoc] = useState<ContextDoc | null>(null);
    const [contextLoading, setContextLoading] = useState(true);

    // Parse chatId to determine context
    useEffect(() => {
        if (!chatId) return;
        setContextLoading(true);
        const [type, id] = chatId.split('-');
        if (type === 'job' || type === 'tool' || type === 'property') {
            setContextType(type as 'job' | 'tool' | 'property');
        } else {
            setContextType('unknown');
        }
        setContextLoading(false);
    }, [chatId]);

    // Fetch context document (Job, Tool, Property)
    const contextDocRef = useMemoFirebase(() => {
        if (!firestore || contextLoading || contextType === 'unknown') return null;
        const id = chatId.split('-').slice(1).join('-');
        if (contextType === 'job') return doc(firestore, 'jobs', id);
        if (contextType === 'tool') return doc(firestore, 'tools', id);
        if (contextType === 'property') return doc(firestore, 'properties', id);
        return null;
    }, [firestore, chatId, contextType, contextLoading]);
    const { data: fetchedContextDoc, isLoading: isContextDocLoading } = useDoc<ContextDoc>(contextDocRef);
    
    // Fetch rental doc for tool chats
     const rentalDocRef = useMemoFirebase(() => {
        if (!firestore || contextType !== 'tool') return null;
        return doc(firestore, 'rentals', chatId);
    }, [firestore, chatId, contextType]);
    const { data: fetchedRentalDoc } = useDoc<Rental>(rentalDocRef);


    // Set the primary context document
    useEffect(() => {
        if(contextType === 'tool') {
            // For tools, we merge tool data and rental data
            if(fetchedContextDoc) {
                 setContextDoc({ ...fetchedContextDoc, ...fetchedRentalDoc } as ContextDoc);
            }
        } else {
            setContextDoc(fetchedContextDoc);
        }
    },[fetchedContextDoc, fetchedRentalDoc, contextType])
    
    // Determine the "other user" from the context document
    const otherUserId = useMemoFirebase(() => {
        if (!contextDoc || !user) return null;
        if (contextType === 'job') return (contextDoc as Job).workerId;
        if (contextType === 'tool' || contextType === 'property') {
            const ownerId = (contextDoc as Tool | Property).ownerId;
            // If current user is the owner, other user is the renter/buyer (need to get from chat/rental doc)
            // For now, assume current user is NOT the owner.
            return user.uid === ownerId ? (contextDoc as Rental)?.renterId : ownerId;
        }
        return null;
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

    // Mock messages for now
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
        switch(contextType) {
            case 'job': return (otherUser as UserEntity)?.skills?.[0] || 'Worker';
            case 'tool': return 'Tool Owner';
            case 'property': return 'Property Owner';
            default: return 'User';
        }
    }

    const getContextTitle = () => {
         switch(contextType) {
            case 'job': return (contextDoc as Job)?.ai_diagnosis || 'Service Request';
            case 'tool': return (contextDoc as Tool)?.name || 'Tool Rental';
            case 'property': return (contextDoc as Property)?.title || 'Property Inquiry';
            default: return 'Conversation';
        }
    }
    
    return (
        <div className="flex flex-col h-full bg-background text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="-ml-2" asChild>
                        <Link href="/find-a-worker"><ArrowLeft/></Link>
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

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <DealFlowControls context={contextDoc} docId={chatId} contextType={contextType} />
                <InvoiceCard job={contextDoc as Job} contextType={contextType} />
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

            {/* Footer with Smart Buttons */}
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
