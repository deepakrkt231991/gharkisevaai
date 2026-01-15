"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, CheckCircle, Clock, IndianRupee, MapPin } from "lucide-react";
import Image from "next/image";

// Mock Data
const metrics = {
  totalOrders: 1250,
  dailyRevenue: "₹85,000",
  activeWorkers: 150,
  aiTrend: "AC Repair is the most requested service this week."
};

const sosAlerts = [
  { id: "SOS001", user: "Rina Devi", level: "High", time: "2 mins ago", location: "Sector 15, Noida" },
  { id: "SOS002", user: "Worker: Sunil P.", level: "Low", time: "1 hour ago", location: "Malviya Nagar, Delhi" },
];

const pendingVerifications = [
  { id: "KYC021", name: "Ramesh Singh", avatar: "/placeholder.svg", suggestion: "Approve", confidence: 95 },
  { id: "KYC022", name: "Geeta Kumari", avatar: "/placeholder.svg", suggestion: "Reject", confidence: 70, reason: "Face does not match ID photo." },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Command Center</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening on GHAR KI SEVA AI.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="sos">
            <AlertTriangle className="mr-2 h-4 w-4" /> SOS Alerts
          </TabsTrigger>
          <TabsTrigger value="verification">
            <CheckCircle className="mr-2 h-4 w-4" /> Worker Verification
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
                    <TableHead>AI Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sosAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.user}</TableCell>
                      <TableCell>
                        <Badge variant={alert.level === 'High' ? 'destructive' : 'secondary'}>
                          {alert.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2"><MapPin size={14}/> {alert.location}</TableCell>
                      <TableCell>{alert.time}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
              <CardDescription>Approve or reject new worker applications based on AI suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.map((p) => (
                  <Card key={p.id} className="flex flex-col md:flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${p.id}`} alt={p.name} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {p.id}</p>
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="font-medium">AI Suggestion:</p>
                        <Badge variant={p.suggestion === 'Approve' ? 'default' : 'destructive'} className="bg-green-500">
                            {p.suggestion} (Confidence: {p.confidence}%)
                        </Badge>
                        {p.reason && <p className="text-xs text-destructive mt-1">{p.reason}</p>}
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline">View Documents</Button>
                      <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                      <Button variant="destructive">Reject</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
