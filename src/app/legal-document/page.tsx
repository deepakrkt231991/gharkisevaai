'use client'

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// इसे पूरी तरह क्लाइंट-साइड कर देते हैं ताकि Vercel इसे बिल्ड के समय छुए भी नहीं
const RemoteViewer = dynamic(
  () => import('@/components/legal-document-viewer').then((mod) => mod.LegalDocumentViewer),
  { 
    ssr: false,
    loading: () => <div className="p-10 text-center text-white">Loading Viewer...</div>
  }
);

export default function LegalDocumentPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/legal-vault"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-center flex-1 pr-10">AI Legal Agreement</h1>
        </header>
        
        <main className="flex-1 p-4 pb-32 overflow-y-auto">
          {/* यहाँ हमने इसे पूरी तरह से अलग कर दिया है */}
          <Suspense fallback={<div>Loading...</div>}>
            <RemoteViewer />
          </Suspense>
        </main>

        <BottomNavBar />
      </div>
    </div>
  );
}