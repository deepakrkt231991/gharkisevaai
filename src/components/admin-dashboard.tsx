"use client";

import { useMemo, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, IndianRupee, MapPin, Loader2 } from "lucide-react";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";
import type { SOSAlert, Worker } from "@/lib/entities";
import { approveWorker, rejectWorker } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const metrics = {
  totalOrders: 1250,
  dailyRevenue: "₹85,000",
  activeWorkers: 150,
  aiTrend: "AC Repair is the most requested service this week."
};

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

export function AdminDashboard() {
  const firestore = useFirestore();

  const sosAlertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sos_alerts'), where('status', '==', 'active'));
  }, [firestore]);
  
  const pendingVerificationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query for workers who are NOT verified
    return query(collection(firestore, 'workers'), where('isVerified', '==', false));
  }, [firestore]);

  const { data: sosAlerts, isLoading: sosLoading } = useCollection<SOSAlert>(sosAlertsQuery);
  const { data: pendingVerifications, isLoading: pendingLoading } = useCollection<Worker>(pendingVerificationsQuery);
  
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
        <h1 className="text-3xl font-bold font-headline">Admin Command Center</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening on GrihSeva AI.</p>
      </div>

      <Tabs defaultValue="verification">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="sos">
            <AlertTriangle className="mr-2 h-4 w-4" /> SOS Alerts
          </TabsTrigger>
          <TabsTrigger value="verification">
            <CheckCircle className="mr-2 h-4 w-4" /> Worker Verification
             {pendingVerifications && pendingVerifications.length > 0 && (
                <Badge className="ml-2">{pendingVerifications.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview / Real-time Metrics Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Metrics</CardTitle>
              <CardDescription>{metrics.aiTrend}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl">{metrics.totalOrders}</CardTitle>
                    <CardDescription>Total Orders</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl">{metrics.dailyRevenue}</CardTitle>
                    <CardDescription>Today's Revenue</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-4xl">{metrics.activeWorkers}</CardTitle>
                    <CardDescription>Active Workers</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOS Alerts Tab */}
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

        {/* Worker Verification Tab */}
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
      </Tabs>
    </div>
  );
}
