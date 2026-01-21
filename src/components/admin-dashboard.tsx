
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
import type { SOSAlert, Worker, Transaction, Deal } from "@/lib/entities";
import { approveWorker, rejectWorker, generateAdminPromoPoster, type PosterState, withdrawAdminFunds } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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
        <p className="text-sm font-medium text-white/70">TOTAL APP EARNINGS (WITHDRAWABLE)</p>
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

  const disputedDealsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'deals'), where('status', '==', 'disputed'));
  }, [firestore]);

  const { data: sosAlerts, isLoading: sosLoading } = useCollection<SOSAlert>(sosAlertsQuery);
  const { data: pendingVerifications, isLoading: pendingLoading } = useCollection<Worker>(pendingVerificationsQuery);
  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: disputedDeals, isLoading: disputesLoading } = useCollection<Deal>(disputedDealsQuery);

  const { totalVolume, platformFees, referralPayouts, netProfit } = useMemo(() => {
    if (!transactions) return { totalVolume: 0, platformFees: 0, referralPayouts: 0, netProfit: 0 };
    
    let volume = 0;
    let fees = 0;
    let referrals = 0;
    
    const processedJobs = new Set();

    transactions.forEach(tx => {
        // Calculate total volume from payouts and platform fees to avoid double counting
        if ((tx.type === 'payout' || tx.type === 'platform_fee' || tx.type === 'tax') && tx.sourceJobId && !processedJobs.has(tx.sourceJobId)) {
            // Find all transactions for this job to sum up the total cost
            const jobTransactions = transactions.filter(t => t.sourceJobId === tx.sourceJobId && (t.type === 'payout' || t.type === 'platform_fee' || t.type === 'tax'));
            const jobTotal = jobTransactions.reduce((sum, current) => sum + current.amount, 0);
            volume += jobTotal;
            processedJobs.add(tx.sourceJobId);
        }

        if (tx.type === 'platform_fee') {
            fees += tx.amount;
        }
        if (tx.type === 'referral_commission') {
            referrals += tx.amount;
        }
    });

    return { 
        totalVolume: volume, 
        platformFees: fees, 
        referralPayouts: referrals,
        netProfit: fees - referrals
    };
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
              title="Total Transaction Volume"
              value={`₹${totalVolume.toFixed(2)}`}
              description="Total value of all completed jobs"
              icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Platform Fee Earned"
              value={`₹${platformFees.toFixed(2)}`}
              description="Your gross revenue from fees"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Referral Payouts"
              value={`- ₹${referralPayouts.toFixed(2)}`}
              description="Commissions paid to referrers"
              icon={<Share2 className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
              title="Net Profit"
              value={`₹${netProfit.toFixed(2)}`}
              description="Platform Fees - Payouts"
              icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          />
      </div>
      
      <RevenueWithdrawalCard netProfit={netProfit} />
      
      <WeeklyGrowthReport />

      <Tabs defaultValue="verification">
        <TabsList className="grid w-full grid-cols-5">
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
           <TabsTrigger value="disputes">
            <AlertTriangle className="mr-2 h-4 w-4" /> Disputes
             {disputedDeals && disputedDeals.length > 0 && (
                <Badge variant="destructive" className="ml-2">{disputedDeals.length}</Badge>
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
                            <TableHead>Job ID</TableHead>
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
                                    <TableCell className="font-semibold">₹{tx.amount.toFixed(2)}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.sourceJobId || 'N/A'}</TableCell>
                                    <TableCell>{getTimeAgo(tx.timestamp)}</TableCell>
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
                        <TableCell className="flex items-center gap-2"><MapPin size={14}/> {`${alert.location.latitude?.toFixed(4)}, ${alert.location.longitude?.toFixed(4)}`} </TableCell>
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
                                         <Link href={`/chat/deal-${deal.id}`}>View Chat</Link>
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
