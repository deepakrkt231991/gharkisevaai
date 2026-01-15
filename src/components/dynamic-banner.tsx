
"use client";

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { AppSettings } from '@/lib/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PartyPopper } from 'lucide-react';

export function DynamicBanner() {
  const firestore = useFirestore();

  // Memoize the document reference to prevent re-renders
  const bannerDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'app_settings', 'top_banner');
  }, [firestore]);

  const { data: bannerData, isLoading } = useDoc<AppSettings>(bannerDocRef);

  const parsedContent = useMemo(() => {
    if (!bannerData?.content) return { hindi: '', english: '' };

    // Split the content by newline to separate Hindi and English parts
    const parts = bannerData.content.split('\n');
    const hindi = parts.find(p => /[\u0900-\u097F]/.test(p)) || parts[0] || ''; // Simple heuristic for Hindi
    const english = parts.find(p => !/[\u0900-\u097F]/.test(p)) || parts[1] || '';

    return { hindi, english };
  }, [bannerData]);


  if (isLoading) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!bannerData || !bannerData.content) {
    // Don't render anything if there's no banner content
    return null;
  }

  return (
    <Card 
      className="border-2 border-dashed"
      style={{
        borderColor: bannerData.backgroundColor || 'hsl(var(--primary))',
        backgroundColor: bannerData.backgroundColor ? `${bannerData.backgroundColor}20` : 'hsl(var(--primary) / 0.1)',
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: bannerData.backgroundColor || 'hsl(var(--primary))' }}>
            <PartyPopper className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">{parsedContent.hindi}</p>
            <p className="text-sm text-muted-foreground">{parsedContent.english}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
