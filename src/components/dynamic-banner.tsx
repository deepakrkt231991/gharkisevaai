
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
    const parts = bannerData.content.split('\n').filter(p => p.trim() !== '');
    const hindi = parts.find(p => /[\u0900-\u097F]/.test(p)) || ''; 
    const english = parts.find(p => !/[\u0900-\u097F]/.test(p)) || '';
    
    // Fallback logic if one is missing or not detected
    if(parts.length === 1) {
        return { hindi: parts[0], english: '' };
    }
    if (parts.length > 1 && (!hindi || !english)) {
        return { hindi: parts[0], english: parts.slice(1).join(' ') };
    }


    return { hindi, english };
  }, [bannerData]);


  if (isLoading) {
    return (
        <Card className="bg-secondary/50">
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
  
  const baseColor = bannerData.backgroundColor || 'hsl(var(--primary))';

  return (
    <Card 
      className="border-2 border-dashed shadow-lg"
      style={{
        borderColor: baseColor,
        backgroundColor: `${baseColor}20`, // Adding ~12% opacity to the hex color
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: baseColor }}>
            <PartyPopper className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            {parsedContent.hindi && <p className="font-bold text-lg" style={{color: baseColor}}>{parsedContent.hindi}</p>}
            {parsedContent.english && <p className="text-sm text-muted-foreground">{parsedContent.english}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
