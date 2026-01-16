'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Palette, Moon } from 'lucide-react';

export function AppSettings() {
  return (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-white flex items-center gap-2">
            <Bell />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-border">
            <Label htmlFor="job-updates" className="flex flex-col gap-1">
              <span className="font-semibold text-white">Job Updates</span>
              <span className="text-xs text-muted-foreground">Status changes, messages, etc.</span>
            </Label>
            <Switch id="job-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-border">
             <Label htmlFor="promotions" className="flex flex-col gap-1">
              <span className="font-semibold text-white">Promotions</span>
              <span className="text-xs text-muted-foreground">Offers and new features.</span>
            </Label>
            <Switch id="promotions" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-white flex items-center gap-2">
            <Palette />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-border">
            <Label htmlFor="dark-mode" className="font-semibold text-white flex items-center gap-2">
              <Moon/> Dark Mode
            </Label>
            <Switch id="dark-mode" defaultChecked disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
