'use client'; // Need this to use hooks

import { Header } from '@/components/header';
import { AdminDashboard } from '@/components/admin-dashboard';
import { useUser } from '@/firebase';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// IMPORTANT: This email is the master admin for the entire app.
const ADMIN_EMAIL = "gharkisevaai@gmail.com"; 

export default function AdminPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-secondary/50">
        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // Temporarily allowing any logged-in user for account recovery.
  // The original check was: if (!user || user.email !== ADMIN_EMAIL)
  if (!user) {
    return (
       <div className="flex flex-col min-h-screen items-center justify-center bg-secondary/50 p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <ShieldAlert className="h-8 w-8 text-destructive"/>
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You do not have permission to view this page. Please log in to continue.</p>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <AdminDashboard />
        </div>
      </main>
    </div>
  );
}
