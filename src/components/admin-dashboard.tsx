"use client";

import { useMemo, useTransition, useActionState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, IndianRupee, MapPin, Loader2, Share2, Sparkles, Download, Bot } from "lucide-react";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { SOSAlert, Worker, Transaction } from "@/lib/entities";
import { approveWorker, rejectWorker, generateAdminPromoPoster, type PosterState } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
        // Assuming all transactions contribute to total revenue for simplicity
        total += tx.amount;
        if (tx.type === 'referral_commission') {
            referral += tx.amount;
        }
    });
    // This is a simplification. Real total revenue would likely be service fees, not just sum of all transactions.
    // Let's assume for now total revenue is just the sum of all transaction amounts.
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
        <p className="text-muted-foreground">Welcome back! Here's your real-time business overview.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toFixed(2)}`}
              icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Referral Payouts"
              value={`₹${referralRevenue.toFixed(2)}`}
              icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Pending Verifications"
              value={pendingLoading ? '...' : (pendingVerifications?.length || 0)}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Active SOS Alerts"
              value={sosLoading ? '...' : (sosAlerts?.length || 0)}
              icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          />
      </div>

      <Tabs defaultValue="verification">
        <TabsList className="grid w-full grid-cols-4">
           <TabsTrigger value="verification">
            <CheckCircle className="mr-2 h-4 w-4" /> Verification
             {pendingVerifications && pendingVerifications.length > 0 && (
                <Badge className="ml-2">{pendingVerifications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transactions"><TrendingUp className="mr-2 h-4 w-4" /> Transactions</TabsTrigger>
           <TabsTrigger value="marketing"><Share2 className="mr-2 h-4 w-4" /> Marketing</TabsTrigger>
          <TabsTrigger value="sos">
            <AlertTriangle className="mr-2 h-4 w-4" /> SOS Alerts
             {sosAlerts && sosAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">{sosAlerts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
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
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactionsLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading transactions...</TableCell></TableRow>}
                        {transactions && transactions.length > 0 ? (
                            transactions.slice(0, 10).map(tx => (
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
                 {pendingLoading && <div className="text-center p-8 flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Loading pending verifications...</div>}
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
                        <TableCell className="flex items-center gap-2"><MapPin size={14}/> {`${alert.location.latitude?.toFixed(4)}, ${alert.location.longitude?.toFixed(4)}`}</TableCell>
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
