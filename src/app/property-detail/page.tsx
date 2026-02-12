'use client';
import { Suspense } from 'react';
import { PropertyDetailPage } from '@/components/property-detail-page';
import { Skeleton } from '@/components/ui/skeleton';

function PropertyDetailFallback() {
    return (
        <div className="flex-1">
             <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </header>
             <main>
                <Skeleton className="w-full aspect-[4/3]" />
                <div className="bg-background rounded-t-3xl p-4 -mt-8 relative z-10 space-y-6 pb-24">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-3/4"/>
                        <Skeleton className="h-5 w-1/2"/>
                        <Skeleton className="h-10 w-1/3"/>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                </div>
             </main>
        </div>
    );
}

export default function PropertyDetail() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <Suspense fallback={<PropertyDetailFallback />}>
          <PropertyDetailPage />
        </Suspense>
      </div>
    </div>
  );
}
