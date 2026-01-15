
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Banknote, Briefcase, Group, IndianRupee, Landmark, Trophy, ShieldCheck, Gem, Star, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock data based on the UI concept
const totalBalance = "12,450.50";
const directEarnings = "11,200";
const referralEarnings = "1,250.50";
const referralsCount = 8;
const referralsNeededForSilver = 10;

const activityItems = [
  { name: "Amit Singh", action: "TV Repair done", income: "+₹0.75", avatar: "AS" },
  { name: "Rahul Verma", action: "AC Service done", income: "+₹1.20", avatar: "RV" },
  { name: "Suresh K.", action: "New Worker Added", income: "Bonus Active", avatar: "SK" },
  { name: "Priya Sharma", action: "Fridge Repair done", income: "+₹0.90", avatar: "PS" },
];

const topEarners = [
    { name: "Vikas Gupta", earnings: "₹5,800", avatar: "VG" },
    { name: "Anjali Sharma", earnings: "₹4,250", avatar: "AS" },
    { name: "Sanjay Patel", earnings: "₹3,100", avatar: "SP" },
    { name: "Meera Singh", earnings: "₹2,500", avatar: "MS" },
    { name: "Rohit Kumar", earnings: "₹1,900", avatar: "RK" },
];

export function EarningsDashboard() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">Meri Kamayi (My Earnings)</h1>
                <p className="text-muted-foreground">Track your direct and referral earnings.</p>
            </div>
            <Card className="p-2">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">English</Button>
                    <Button variant="secondary" size="sm">हिंदी</Button>
                </div>
            </Card>
        </div>
        
        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-primary via-primary/90 to-orange-600 text-primary-foreground shadow-lg border-none">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-primary-foreground/80">Kul Balance (Total)</p>
              <h2 className="text-4xl font-bold">
                <IndianRupee className="inline h-8 w-8 -mt-2" />
                {totalBalance}
              </h2>
              <Button variant="secondary" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Landmark className="mr-2 h-4 w-4" />
                Bank me bhejein (Withdraw)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EarningCard
            title="Direct Kaam"
            amount={`₹${directEarnings}`}
            icon={Briefcase}
            color="text-orange-500"
          />
          <EarningCard
            title="Referral Team"
            amount={`₹${referralEarnings}`}
            icon={Group}
            color="text-green-500"
          />
        </div>

        {/* Gamification: Leaderboard and Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="text-yellow-500" />Top 5 Partners</CardTitle>
                    <CardDescription>See who is leading the referral race!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topEarners.map((earner, index) => (
                           <div key={index} className="flex items-center space-x-4">
                               <Avatar>
                                   <AvatarFallback className="font-bold">{earner.avatar}</AvatarFallback>
                               </Avatar>
                               <div className="flex-1">
                                   <p className="font-semibold">{earner.name}</p>
                               </div>
                               <p className="font-bold text-green-600">₹{earner.earnings}</p>
                           </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="text-blue-500" />My Partner Level</CardTitle>
                    <CardDescription>Unlock new badges by growing your team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                        <Badge className="bg-orange-200 text-orange-800 text-sm">Bronze Partner</Badge>
                        <p className="text-muted-foreground">You have referred {referralsCount} people.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <h4 className="font-semibold flex items-center gap-1"><ShieldCheck className="text-gray-400" />Next Level: Silver Partner</h4>
                            <p className="text-sm text-muted-foreground">{referralsCount}/{referralsNeededForSilver}</p>
                        </div>
                        <Progress value={(referralsCount / referralsNeededForSilver) * 100} />
                        <p className="text-xs text-muted-foreground text-center">Refer {referralsNeededForSilver - referralsCount} more people to become a Silver Partner!</p>
                    </div>
                    <div className="text-center text-muted-foreground pt-4">
                        <p className="font-bold flex items-center justify-center gap-2"><Gem className="text-yellow-600" />Gold Partner <span className="text-xs">(100 Referrals)</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>


        {/* Referral Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Activity (0.05% Life-time Income)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityItems.map((item, index) => (
                <ActivityItem key={index} {...item} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EarningCard({ title, amount, icon: Icon, color }: { title: string, amount: string, icon: LucideIcon, color: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
        <Icon className={`h-8 w-8 ${color}`} />
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{amount}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ name, action, income, avatar }: { name: string, action: string, income: string, avatar: string }) {
  const isBonus = income.toLowerCase().includes('bonus');
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarFallback>{avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{action}</p>
      </div>
      <p className={`font-bold ${isBonus ? 'text-blue-500' : 'text-green-600'}`}>
        {income}
      </p>
    </div>
  );
}
