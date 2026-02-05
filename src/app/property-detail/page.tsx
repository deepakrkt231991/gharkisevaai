'use client';
import { PropertyDetailPage } from '@/components/property-detail-page';
import { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function PropertyDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="dark bg-background text-foreground">
            <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
                 <PropertyDetailPage />
            </div>
        </div>
    </Suspense>
  );
}
