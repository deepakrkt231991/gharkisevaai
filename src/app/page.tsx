'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary"/>
      <p className="mt-4 text-muted-foreground">Initializing App...</p>
    </div>
  );
}
