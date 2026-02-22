
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MaintenancePage } from '@/components/maintenance-page';
import { Loader2 } from 'lucide-react';
import type { AppSettings } from '@/lib/entities';
import React from 'react';
import { PwaLoader } from '@/components/pwa-loader';
import { PwaUpdateNotifier } from '@/components/pwa-update-notifier';
import { FloatingAiAssistant } from '@/components/floating-ai-assistant';
import { Toaster } from "@/components/ui/toaster";
import { InstallPwaBanner } from './install-pwa-banner';

const ADMIN_EMAIL = "deepakkadam231991@gmail.com"; 

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Assuming the settings doc has a specific ID, e.g., 'global'
  // This is a common pattern for global settings.
  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'app_settings', 'global'); 
  }, [firestore]);

  const { data: settings, isLoading: isSettingsLoading } = useDoc<AppSettings>(settingsRef);
  
  const isLoading = isUserLoading || isSettingsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        <p className="mt-4 text-muted-foreground">Loading App...</p>
      </div>
    );
  }

  const isMaintenanceMode = settings?.isMaintenanceMode === true;
  const isAdmin = user?.email === ADMIN_EMAIL;

  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  // If not in maintenance mode, or if user is admin, render the full app shell
  return (
    <>
        <PwaLoader />
        <PwaUpdateNotifier />
        {children}
        <FloatingAiAssistant />
        <InstallPwaBanner />
        <Toaster />
    </>
  );
}
