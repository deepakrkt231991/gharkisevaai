"use client";

import { useMemo, useTransition, useActionState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, IndianRupee, MapPin, Loader2, Share2, Sparkles, Download, Copy, Bot } from "lucide-react";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { SOSAlert, Worker, Transaction } from "@/lib/entities";
import { approveWorker, rejectWorker, generateAdminPromoPoster, type PosterState, generateSocialAd, type AdState } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function WorkerVerificationRow({ worker }: { worker: Worker & {id: string} }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

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

    return (
         <Card className="flex flex-col md:flex-row items-center justify-between p-4">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${worker.workerId}`} alt={(worker as any).name} />
                    <AvatarFallback>{(worker as any).name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{(worker as any).name}</p>
                    <p className="text-sm text-muted-foreground">ID: {worker.workerId}</p>
                    <p className="text-sm font-bold text-primary capitalize">{worker.skills?.join(', ')}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" disabled={isPending}>View Documents</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                    Approve
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isPending}>Reject</Button>
            </div>
        </Card>
    )
}

function SocialAdGenerator() {
    const initialState: AdState = { success: false, message: '', data: null };
    const [state, formAction] = useActionState(generateSocialAd, initialState);
    const { toast } = useToast();

    const SubmitButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                Generate Ad Copy
            </Button>
        )
    }

    const handleCopy = () => {
        if (state.data?.adCopy) {
            navigator.clipboard.writeText(state.data.adCopy);
            toast({ title: "Copied!", description: "Ad copy copied to clipboard." });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Social Media Ad Generator</CardTitle>
                <CardDescription>Generate ad copy for LinkedIn, Facebook, and Instagram.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <form action={formAction} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="topic">Ad Topic</Label>
                        <Input id="topic" name="topic" defaultValue="Hiring verified plumbers in Delhi" />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="platform">Platform</Label>
                         <Select name="platform" defaultValue="Facebook">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                            </SelectContent>
                        </Select>
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

                 {state?.success && state.data?.adCopy && (
                    <div className="space-y-4 pt-4">
                        <h3 className="font-semibold">Generated Ad Copy:</h3>
                        <div className="relative w-full rounded-lg border bg-secondary p-4 whitespace-pre-wrap font-mono text-sm max-h-60 overflow-y-auto">
                            {state.data.adCopy}
                        </div>
                        <Button onClick={handleCopy} variant="outline">
                            <Copy className="mr-2 h-4 w-4" /> Copy Text
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PosterGenerator() {
    const initialState: PosterState = { success: false, message: '', data: null };
    const [state, formAction] = useActionState(generateAdminPromoPoster, initialState);

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
            <SocialAdGenerator />
            <PosterGenerator />
        </div>
    );
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

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'transactions'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: sosAlerts, isLoading: sosLoading } = useCollection<SOSAlert>(sosAlertsQuery);
  const { data: pendingVerifications, isLoading: pendingLoading } = useCollection<Worker>(pendingVerificationsQuery);
  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);

  const { totalRevenue, referralRevenue } = useMemo(() => {
    if (!transactions) return { totalRevenue: 0, referralRevenue: 0 };
    
    let total = 0;
    let referral = 0;
    transactions.forEach(tx => {
        total += tx.amount;
        if (tx.type === 'referral_commission') {
            referral += tx.amount;
        }
    });
    return { totalRevenue: total, referralRevenue: referral };
  }, [transactions]);

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Ghar Ki Seva - Admin Panel</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening on the platform.</p>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-4">
           <TabsTrigger value="metrics"><TrendingUp className="mr-2 h-4 w-4" /> Metrics</TabsTrigger>
          <TabsTrigger value="verification">
            <CheckCircle className="mr-2 h-4 w-4" /> Verification
             {pendingVerifications && pendingVerifications.length > 0 && (
                <Badge className="ml-2">{pendingVerifications.length}</Badge>
            )}
          </TabsTrigger>
           <TabsTrigger value="marketing"><Share2 className="mr-2 h-4 w-4" /> Marketing</TabsTrigger>
          <TabsTrigger value="sos">
            <AlertTriangle className="mr-2 h-4 w-4" /> SOS Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Tracker</CardTitle>
              <CardDescription>Real-time revenue and commission data.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl">₹{totalRevenue.toFixed(2)}</CardTitle>
                            <CardDescription>Total Revenue</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-4xl">₹{referralRevenue.toFixed(2)}</CardTitle>
                            <CardDescription>Referral Commissions Paid</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                 <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactionsLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading transactions...</TableCell></TableRow>}
                        {transactions && transactions.length > 0 ? (
                            transactions.slice(0, 5).map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-mono text-xs">{tx.userId}</TableCell>
                                    <TableCell><Badge variant={tx.type === 'referral_commission' ? 'default' : 'secondary'}>{tx.type.replace('_', ' ')}</Badge></TableCell>
                                    <TableCell className="font-semibold">₹{tx.amount.toFixed(2)}</TableCell>
                                    <TableCell>{getTimeAgo(tx.timestamp)}</TableCell>
                                </TableRow>
                            ))
                        ) : !transactionsLoading && (
                            <TableRow><TableCell colSpan={4} className="text-center">No transactions yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                 </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Pending Worker Verifications</CardTitle>
              <CardDescription>Approve or reject new worker applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {pendingLoading && <p className="text-center p-8">Loading pending verifications...</p>}
                 {pendingVerifications && pendingVerifications.length > 0 ? (
                    pendingVerifications.map((p) => (
                      <WorkerVerificationRow key={p.id} worker={p} />
                    ))
                 ) : !pendingLoading && (
                    <p className="text-center text-muted-foreground p-8">No pending verifications.</p>
                 )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
            <MarketingHub />
        </TabsContent>

        <TabsContent value="sos">
          <Card>
            <CardHeader>
              <CardTitle>Pending SOS Alerts</CardTitle>
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
                      <TableCell colSpan={4} className="text-center">Loading alerts...</TableCell>
                    </TableRow>
                  )}
                  {sosAlerts && sosAlerts.length > 0 ? (
                    sosAlerts.map((alert) => (
                      <TableRow key={alert.alertId}>
                        <TableCell className="font-medium">{alert.userId}</TableCell>
                        <TableCell className="flex items-center gap-2"><MapPin size={14}/> {`${alert.location.latitude}, ${alert.location.longitude}`}</TableCell>
                        <TableCell>{getTimeAgo(alert.timestamp)}</TableCell>
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
      </Tabs>
    </div>
  );
}
