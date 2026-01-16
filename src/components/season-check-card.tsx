'use client';

import { useDoc, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import type { AppSettings } from '@/lib/entities';
import { doc } from 'firebase/firestore';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';

export function SeasonCheckCard() {
  const firestore = useFirestore();

  const settingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // The 'top_banner' doc holds the dynamic content
    return doc(firestore, 'app_settings', 'top_banner');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<AppSettings>(settingsQuery);

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  // Don't render anything if there's no setting, to avoid empty space
  if (!settings?.content) {
    return null;
  }

  // Split content by newline for multi-line display
  const [line1, line2] = (settings.content || '').split('\\n');

  return (
    <Card
      className="border-none text-white overflow-hidden shadow-lg"
      style={{ backgroundColor: settings.backgroundColor || '#FF8C00' }}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-white/10 p-3 rounded-full border border-white/20">
            <Gift className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold font-headline text-lg leading-tight">{line1 || "Special Offer"}</h2>
          {line2 && <p className="text-sm opacity-90">{line2}</p>}
        </div>
        <Button asChild size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-full flex-shrink-0">
            <Link href="/promote">
                <ArrowRight />
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
