

"use client";

import { useMemo, useTransition, useState, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, IndianRupee, MapPin, Loader2, Share2, Sparkles, Download, Bot, Banknote, Hammer, Home, ShoppingBag, Send, Image as ImageIcon, Edit } from "lucide-react";
import { useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { SOSAlert, Worker, Transaction, Deal, Property, Banner } from "@/lib/entities";
import { approveWorker, rejectWorker, generateAdminPromoPoster, type PosterState, withdrawAdminFunds, approvePropertyAndGenerateCertificate, rejectProperty, markPayoutAsProcessed, createBanner, type BannerState } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Logo } from "./logo";
import Image from "next/image";

// New component to handle client-side time rendering to prevent hydration errors
const TimeAgo = ({ timestamp }: { timestamp: any }) => {
  const [time, setTime] = useState<string>('...');

  useEffect(() => {
    if (!timestamp?.toDate) {
      setTime('N/A');
      return;
    }
    const date = timestamp.toDate();
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) { setTime(Math.floor(interval) + " years ago"); return; }
    interval = seconds / 2592000;
    if (interval > 1) { setTime(Math.floor(interval) + " months ago"); return; }
    interval = seconds / 86400;
    if (interval > 1) { setTime(Math.floor(interval) + " days ago"); return; }
    interval = seconds / 3600;
    if (interval > 1) { setTime(Math.floor(interval) + " hours ago"); return; }
    interval = seconds / 60;
    if (interval > 1) { setTime(Math.floor(interval) + " minutes ago"); return; }
    setTime(Math.floor(seconds) + " seconds ago");
  }, [timestamp]);

  return <>{time}</>;
};

function StatCard({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode, description?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

function EditWorkerDialog({ worker }: { worker: Worker & {id: string} }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [name, setName] = useState(worker.name || '');
    const [skills, setSkills] = useState(worker.skills?.join(', ') || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        if (!firestore) {
            toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
            setIsSaving(false);
            return;
        }
        const workerRef = doc(firestore, 'workers', worker.id);
        try {
            await updateDoc(workerRef, {
                name: name,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            });
            toast({ title: "Success", description: "Worker profile updated.", className: "bg-green-600 text-white" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    }
    
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Edit Worker: {worker.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="skills" className="text-right">Skills</Label>
                    <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} className="col-span-3" placeholder="plumber, electrician"/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button onClick={handleSave} disabled={isSaving}>
                         {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Save changes
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

function WorkerVerificationRow({ worker }: { worker: Worker & {id: string} }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveWorker(worker.id);
            if(result.success) {
                toast({ title: "Success", description: `Worker ${worker.name} has been approved.`, className: "bg-green-600 text-white" });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        });
    };

    const handleReject = () => {
         startTransition(async () => {
            if (confirm(`Are you sure you want to reject and delete the profile for ${worker.name}? This action cannot be undone.`)) {
                const result = await rejectWorker(worker.id);
                 if(result.success) {
                    toast({ title: "Success", description: `Worker ${worker.name} has been rejected.` });
                } else {
                    toast({ title: "Error", description: result.message, variant: "destructive" });
                }
            }
        });
    };
    
    const handleViewDocuments = () => {
        toast({
            title: "Feature Coming Soon",
            description: "A secure document viewer is being developed for this feature.",
        });
    };


    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
         <Card className="flex flex-col md:flex-row items-center justify-between p-4">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://picsum.photos/seed/${worker.workerId}/150/150`} alt={worker.name || ''} />
                    <AvatarFallback>{worker.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{worker.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {worker.workerId}</p>
                    <p className="text-sm font-bold text-primary capitalize">{worker.skills?.join(', ')}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={handleViewDocuments} disabled={isPending}>View Documents</Button>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={isPending}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                </DialogTrigger>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Approve
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isPending}>Reject</Button>
            </div>
        </Card>
        <EditWorkerDialog worker={worker} />
        </Dialog>
    )
}

function PropertyVerificationCard({ property }: { property: Property & {id: string} }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approvePropertyAndGenerateCertificate(property.id);
            if(result.success) {
                toast({ title: "Success", description: `Property ${property.title} approved and certificate generated.`, className: "bg-green-600 text-white" });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        });
    };

    const handleReject = () => {
         startTransition(async () => {
            if (confirm(`Are you sure you want to reject this property listing?`)) {
                const result = await rejectProperty(property.id);
                 if(result.success) {
                    toast({ title: "Success", description: `Property ${property.title} has been rejected.` });
                } else {
                    toast({ title: "Error", description: result.message, variant: "destructive" });
                }
            }
        });
    };

    return (
         <Card className="flex flex-col md:flex-row items-start justify-between p-4 gap-4">
            <div className="flex items-start gap-4">
                <Image src={property.imageUrl || 'https://placehold.co/150x100'} alt={property.title || 'Property Image'} width={150} height={100} className="rounded-md object-cover hidden md:block" />
                <div>
                    <p className="font-semibold text-white">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <p className="text-sm text-muted-foreground">Owner: {property.ownerId.substring(0, 8)}...</p>
                    <Badge className="mt-2">{property.listingType}</Badge>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button variant="outline" disabled={isPending} asChild>
                    {/* In a real app, this would open a modal with document links */}
                    <Link href="#" onClick={() => toast({title: "Coming Soon", description: "Document viewer is not yet implemented."})}>View Documents</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Approve & Certify
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isPending}>Reject</Button>
            </div>
        </Card>
    )
}

function PayoutRow({ transaction }: { transaction: Transaction & { id: string } }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const workerRef = useMemoFirebase(() => {
        if (!firestore || !transaction.userId) return null;
        return doc(firestore, 'workers', transaction.userId);
    }, [firestore, transaction.userId]);
    const { data: worker, isLoading } = useDoc<Worker>(workerRef);

    const handleMarkAsPaid = () => {
        startTransition(async () => {
            const result = await markPayoutAsProcessed(transaction.id);
            if (result.success) {
                toast({ title: "Success", description: result.message, className: "bg-green-600 text-white" });
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        });
    };

    if (isLoading) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
            </TableRow>
        );
    }
    
    return (
        <TableRow>
            <TableCell>
                <div className="font-medium">{worker?.name || 'N/A'}</div>
                <div className="text-xs text-muted-foreground font-mono">{transaction.userId}</div>
            </TableCell>
            <TableCell>
                <div className="font-medium">{worker?.bankDetails?.upiId || 'Not Provided'}</div>
                <div className="text-xs text-muted-foreground">UPI ID</div>
            </TableCell>
            <TableCell className="font-semibold text-lg text-white">₹{transaction.amount.toFixed(2)}</TableCell>
            <TableCell>
                <Button onClick={handleMarkAsPaid} disabled={isPending} size="sm">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                    Mark as Paid
                </Button>
            </TableCell>
        </TableRow>
    );
}

function PayoutsTab() {
    const firestore = useFirestore();
    const pendingPayoutsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'transactions'), where('type', '==', 'payout'), where('status', '==', 'pending'));
    }, [firestore]);

    const { data: pendingPayouts, isLoading } = useCollection<Transaction>(pendingPayoutsQuery);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manual Payout Requests</CardTitle>
                <CardDescription>Review and process pending payouts to workers. Click "Mark as Paid" after you complete the UPI transfer outside the app.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Worker</TableHead>
                            <TableHead>UPI ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow>}
                        {pendingPayouts && pendingPayouts.length > 0 ? (
                            pendingPayouts.map(tx => <PayoutRow key={tx.id} transaction={tx} />)
                        ) : !isLoading && (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No pending payouts.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function PosterGenerator() {
    const initialState: PosterState = { success: false, message: '', data: null };
    const [state, formAction] = useFormState(generateAdminPromoPoster, initialState);

    const SubmitButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                Generate Poster
            </Button>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Worker Promo Poster</CardTitle>
                <CardDescription>Create posters for workers to share on WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="workerName">Worker Name</Label>
                        <Input id="workerName" name="workerName" defaultValue="Suresh Kumar" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="workerPhotoUrl">Worker Photo URL</Label>
                        <Input id="workerPhotoUrl" name="workerPhotoUrl" defaultValue="https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400" />
                    </div>
                    <SubmitButton />
                </form>

                {state?.message && !state.success && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}

                {state?.success && state.data?.posterDataUri && (
                    <div className="space-y-4 pt-4">
                        <h3 className="font-semibold">Generated Poster:</h3>
                        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border">
                            <Image src={state.data.posterDataUri} alt="Generated promotional poster" fill objectFit="contain" />
                        </div>
                        <Button asChild>
                            <a href={state.data.posterDataUri} download="promo_poster.png">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function MarketingHub() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> Social Media Ad Generator</CardTitle>
                    <CardDescription>Generate ad copy for LinkedIn, Facebook, and Instagram to hire workers or promote your services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/admin/social-media">Create Ad</Link>
                    </Button>
                </CardContent>
            </Card>
            <PosterGenerator />
        </div>
    );
}

function RevenueWithdrawalCard({ netProfit }: { netProfit: number }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleWithdraw = () => {
    if (netProfit <= 0) {
        toast({ title: "No funds to withdraw", variant: "destructive" });
        return;
    }
    startTransition(async () => {
        // For now, we set a minimum withdrawal of 500 as suggested
        if (netProfit < 500) {
             toast({ title: "Minimum Withdrawal", description: "Minimum withdrawal amount is ₹500.", variant: "destructive" });
             return;
        }
        const result = await withdrawAdminFunds(netProfit);
        if (result.success) {
            toast({ title: "Withdrawal Initiated!", description: result.message, className: "bg-green-600 text-white" });
            // In a real app, we'd revalidate the data to show the new balance.
        } else {
            toast({ title: "Withdrawal Failed", description: result.message, variant: "destructive" });
        }
    });
  }

  return (
    <Card className="bg-gray-900/50 border-accent text-white rounded-xl border">
      <CardContent className="p-6 text-center space-y-3">
        <p className="text-sm font-medium text-white/70">TOTAL NET PROFIT (WITHDRAWABLE)</p>
        <p className="text-4xl font-extrabold text-accent">₹{netProfit.toFixed(2)}</p>
        <Button onClick={handleWithdraw} disabled={isPending || netProfit < 500} className="w-full max-w-xs mx-auto bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-bold">
          {isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
          Withdraw to Bank
        </Button>
        <p className="text-xs text-muted-foreground">Minimum withdrawal amount: ₹500</p>
      </CardContent>
    </Card>
  );
}

function WeeklyGrowthReport() {
    const reportData = [
        { metric: 'Warranty Issued', lastWeek: '45', thisWeek: '110', status: '🚀 144% ↑', statusColor: 'text-green-500' },
        { metric: 'Outside Deal Alerts', lastWeek: '12', thisWeek: '02', status: '✅ (लोग ऐप पर भरोसा कर रहे हैं)', statusColor: 'text-green-500' },
        { metric: 'User Satisfaction', lastWeek: '4.2/5', thisWeek: '4.9/5', status: '⭐ (Best in World)', statusColor: 'text-yellow-400' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Growth & Trust Report</CardTitle>
                <CardDescription>Your weekly performance summary.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white">Metric</TableHead>
                            <TableHead className="text-white">Last Week</TableHead>
                            <TableHead className="text-white">This Week</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((row) => (
                            <TableRow key={row.metric}>
                                <TableCell className="font-medium">{row.metric}</TableCell>
                                <TableCell>{row.lastWeek}</TableCell>
                                <TableCell className="font-bold">{row.thisWeek}</TableCell>
                                <TableCell className={cn("font-semibold", row.statusColor)}>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function BannerManager() {
    const firestore = useFirestore();
    const bannersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'banners'));
    }, [firestore]);
    const { data: banners, isLoading } = useCollection<Banner>(bannersQuery);
    const formRef = useRef<HTMLFormElement>(null);

    const initialState: BannerState = { success: false, message: '' };
    const [state, formAction] = useFormState(createBanner, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({ title: "Success!", description: state.message, className: "bg-green-600 text-white" });
                formRef.current?.reset();
            } else {
                toast({ title: "Error", description: state.message, variant: "destructive" });
            }
        }
    }, [state, toast]);

    const SubmitButton = () => {
        const { pending } = useFormStatus();
        return <Button type="submit" disabled={pending} className="w-full">{pending ? <Loader2 className="animate-spin" /> : 'Add Banner'}</Button>
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Banner</CardTitle>
                    <CardDescription>Add a new promotional banner to the home page carousel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Banner Title</Label>
                            <Input id="title" name="title" placeholder="e.g., Diwali Sale" required />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input id="subtitle" name="subtitle" placeholder="e.g., Flat 20% off on all services" required />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://images.unsplash.com/..." required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="link">Destination Link</Label>
                            <Input id="link" name="link" type="url" placeholder="/explore" defaultValue="/" required />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Current Banners</CardTitle>
                    <CardDescription>This is a live feed of banners on your home page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {isLoading && <p>Loading banners...</p>}
                    {banners && banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <div key={index} className="flex items-center gap-4 p-2 rounded-lg border bg-secondary/50">
                                <Image src={banner.imageUrl} alt={banner.title} width={80} height={45} className="rounded-md object-cover aspect-video" />
                                <div>
                                    <p className="font-semibold">{banner.title}</p>
                                    <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
                                    <Link href={banner.link} className="text-xs text-primary hover:underline" target="_blank">{banner.link}</Link>
                                </div>
                            </div>
                        ))
                    ) : !isLoading && <p className="text-center text-muted-foreground py-8">No banners found.</p>}
                </CardContent>
            </Card>
        </div>
    )
}

export function AdminDashboard() {
  const firestore = useFirestore();

  const sosAlertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sos_alerts'), where('status', '==', 'active'));
  }, [firestore]);
  
  const pendingVerificationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'workers'), where('isVerified', '==', false));
  }, [firestore]);

  const pendingPropertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'properties'), where('verificationStatus', 'in', ['pending', 'review_needed']));
  }, [firestore]);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'transactions'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const disputedDealsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'deals'), where('status', '==', 'disputed'));
  }, [firestore]);

  const { data: sosAlerts, isLoading: sosLoading } = useCollection<SOSAlert>(sosAlertsQuery);
  const { data: pendingVerifications, isLoading: pendingLoading } = useCollection<Worker>(pendingVerificationsQuery);
  const { data: pendingProperties, isLoading: propertiesLoading } = useCollection<Property>(pendingPropertiesQuery);
  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: disputedDeals, isLoading: disputesLoading } = useCollection<Deal>(disputedDealsQuery);

  const {
    totalVolume,
    workerFee,
    marketplaceIncome,
    toolIncome,
    referralPayouts,
    adminWithdrawals,
    netProfit
  } = useMemo(() => {
    if (!transactions) return { totalVolume: 0, workerFee: 0, marketplaceIncome: 0, toolIncome: 0, referralPayouts: 0, adminWithdrawals: 0, netProfit: 0 };
    
    let volume = 0;
    let workerFee = 0;
    let marketplaceIncome = 0;
    let toolIncome = 0;
    let referrals = 0;
    let withdrawals = 0;
    
    const processedJobs = new Set();

    transactions.forEach(tx => {
        // Calculate Total Volume
        if ((tx.type === 'payout' || tx.type === 'platform_fee' || tx.type === 'tax') && tx.sourceJobId && !processedJobs.has(tx.sourceJobId)) {
            const jobTransactions = transactions.filter(t => t.sourceJobId === tx.sourceJobId && (t.type === 'payout' || t.type === 'platform_fee' || t.type === 'tax'));
            const jobTotal = jobTransactions.reduce((sum, current) => sum + current.amount, 0);
            volume += jobTotal;
            processedJobs.add(tx.sourceJobId);
        }

        // Segregate Platform Fees by source
        if (tx.type === 'platform_fee') {
            if (tx.sourceType === 'job') {
                workerFee += tx.amount;
            } else if (tx.sourceType === 'deal') {
                marketplaceIncome += tx.amount;
            } else if (tx.sourceType === 'rental') {
                toolIncome += tx.amount;
            }
        }
        
        if (tx.type === 'referral_commission') {
            referrals += tx.amount;
        }
        if (tx.type === 'admin_withdrawal') {
            withdrawals += Math.abs(tx.amount); // Show total withdrawn as a positive number
        }
    });

    const totalPlatformFees = workerFee + marketplaceIncome + toolIncome;
    const totalDeductions = referrals + withdrawals;

    return { 
        totalVolume: volume, 
        workerFee,
        marketplaceIncome,
        toolIncome,
        referralPayouts: referrals,
        adminWithdrawals: withdrawals,
        netProfit: totalPlatformFees - totalDeductions
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">Welcome back! Here's your real-time business overview.</p>
      </div>

      <Tabs defaultValue="finance" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
           <TabsTrigger value="finance"><IndianRupee className="mr-2 h-4 w-4" /> Finance</TabsTrigger>
           <TabsTrigger value="payouts"><Send className="mr-2 h-4 w-4" /> Payouts</TabsTrigger>
           <TabsTrigger value="verification">
            <CheckCircle className="mr-2 h-4 w-4" /> Verification
             {((pendingVerifications?.length || 0) + (pendingProperties?.length || 0)) > 0 && (
                <Badge className="ml-2">{((pendingVerifications?.length || 0) + (pendingProperties?.length || 0))}</Badge>
            )}
          </TabsTrigger>
           <TabsTrigger value="marketing"><Share2 className="mr-2 h-4 w-4" /> Marketing</TabsTrigger>
           <TabsTrigger value="content"><ImageIcon className="mr-2 h-4 w-4" /> Content</TabsTrigger>
          <TabsTrigger value="sos">
            <AlertTriangle className="mr-2 h-4 w-4" /> SOS Alerts
             {sosAlerts && sosAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">{sosAlerts.length}</Badge>
            )}
          </TabsTrigger>
           <TabsTrigger value="disputes">
            <AlertTriangle className="mr-2 h-4 w-4" /> Disputes
             {disputedDeals && disputedDeals.length > 0 && (
                <Badge variant="destructive" className="ml-2">{disputedDeals.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="finance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                  title="Worker Fee Income"
                  value={`₹${workerFee.toFixed(2)}`}
                  description="From 7% service fee"
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                  title="Marketplace Income"
                  value={`₹${marketplaceIncome.toFixed(2)}`}
                  description="From used item sales"
                  icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                  title="Tool Rental Income"
                  value={`₹${toolIncome.toFixed(2)}`}
                  description="From tool rentals"
                  icon={<Hammer className="h-4 w-4 text-muted-foreground" />}
              />
               <StatCard
                  title="Home Rent Income"
                  value="₹0.00"
                  description="Feature coming soon"
                  icon={<Home className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            
             <RevenueWithdrawalCard netProfit={netProfit} />
             
             <Card>
                <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Total Platform Fees Earned</p>
                        <p className="font-medium text-green-500">+ ₹{(workerFee + marketplaceIncome + toolIncome).toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Referral Commissions Paid</p>
                        <p className="font-medium text-destructive">- ₹{referralPayouts.toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Admin Withdrawals</p>
                        <p className="font-medium text-destructive">- ₹{adminWithdrawals.toFixed(2)}</p>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <div className="flex justify-between items-center font-bold">
                        <p>Net Profit</p>
                        <p className="text-lg">₹{netProfit.toFixed(2)}</p>
                    </div>
                </CardContent>
             </Card>
      
             <WeeklyGrowthReport />

             <Card>
                <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A log of all financial movements on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionsLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading transactions...</TableCell></TableRow>}
                            {transactions && transactions.length > 0 ? (
                                transactions.slice(0, 10).map(tx => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-mono text-xs">{tx.userId}</TableCell>
                                        <TableCell><Badge variant={tx.type === 'referral_commission' ? 'default' : 'secondary'}>{tx.type.replace('_', ' ')}</Badge></TableCell>
                                        <TableCell className={cn("font-semibold", tx.amount < 0 ? "text-destructive" : "text-green-500")}>
                                            {tx.amount < 0 ? `- ₹${'\'\'\''}${Math.abs(tx.amount).toFixed(2)}${'\'\'\''}` : `+ ₹${'\'\'\''}${tx.amount.toFixed(2)}${'\'\'\''}`}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs capitalize">{tx.sourceType || 'Job'} / {tx.sourceJobId?.substring(0,6)}...</TableCell>
                                        <TableCell><TimeAgo timestamp={tx.timestamp} /></TableCell>
                                    </TableRow>
                                ))
                            ) : !transactionsLoading && (
                                <TableRow><TableCell colSpan={5} className="text-center">No transactions yet.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-6">
            <PayoutsTab />
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Worker Verifications</CardTitle>
              <CardDescription>Approve or reject new worker applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {pendingLoading && <div className="text-center p-8 flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Loading pending verifications...</div>}
                 {pendingVerifications && pendingVerifications.length > 0 ? (
                    pendingVerifications.map((p) => (
                      <WorkerVerificationRow key={p.id} worker={p} />
                    ))
                 ) : !pendingLoading && (
                    <p className="text-center text-muted-foreground p-8">No pending worker verifications.</p>
                 )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Property Verifications</CardTitle>
              <CardDescription>Approve or reject new property listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {propertiesLoading && <div className="text-center p-8 flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Loading pending properties...</div>}
                 {pendingProperties && pendingProperties.length > 0 ? (
                    pendingProperties.map((p) => (
                      <PropertyVerificationCard key={p.id} property={p} />
                    ))
                 ) : !propertiesLoading && (
                    <p className="text-center text-muted-foreground p-8">No pending property verifications.</p>
                 )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
            <MarketingHub />
        </TabsContent>

        <TabsContent value="content">
            <BannerManager />
        </TabsContent>

        <TabsContent value="sos">
          <Card>
            <CardHeader>
              <CardTitle>Active SOS Alerts</CardTitle>
              <CardDescription>Review and take immediate action on these alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User/Worker</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sosLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Loading alerts...</TableCell>
                    </TableRow>
                  )}
                  {sosAlerts && sosAlerts.length > 0 ? (
                    sosAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium font-mono text-xs">{alert.userId}</TableCell>
                        <TableCell className="flex items-center gap-2"><MapPin size={14}/> {`${'\'\'\''}${alert.location.latitude?.toFixed(4)}${'\'\'\''}, ${'\'\'\''}${alert.location.longitude?.toFixed(4)}${'\'\'\''}`} </TableCell>
                        <TableCell><TimeAgo timestamp={alert.timestamp} /></TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !sosLoading && (
                     <TableRow>
                      <TableCell colSpan={4} className="text-center">No active SOS alerts.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Disputes</CardTitle>
              <CardDescription>Review and resolve disputes between buyers and sellers.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Deal ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Buyer ID</TableHead>
                          <TableHead>Seller ID</TableHead>
                          <TableHead>Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {disputesLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading disputes...</TableCell></TableRow>}
                      {disputedDeals && disputedDeals.length > 0 ? (
                          disputedDeals.map(deal => (
                              <TableRow key={deal.id}>
                                  <TableCell className="font-mono text-xs">{deal.id}</TableCell>
                                  <TableCell>{deal.productName}</TableCell>
                                  <TableCell className="font-mono text-xs">{deal.buyerId}</TableCell>
                                  <TableCell className="font-mono text-xs">{deal.sellerId}</TableCell>
                                  <TableCell>
                                      <Button asChild variant="outline" size="sm">
                                         <Link href={`/chat/deal-${'\'\'\''}${deal.id}${'\'\'\''}`}>View Chat</Link>
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                      ) : !disputesLoading && (
                          <TableRow><TableCell colSpan={5} className="text-center">No active disputes.</TableCell></TableRow>
                      )}
                  </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    