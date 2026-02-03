'use client'
export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { LegalDocumentViewer } from '@/components/legal-document-viewer';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LegalDocHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/legal-vault">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </Button>
      <h1 className="text-xl font-bold font-headline text-center flex-1 pr-10">AI Legal Agreement</h1>
    </header>
  );
}

// यह असली समाधान है: पूरे कंटेंट को एक अलग फंक्शन में रखें
function LegalContent() {
  return (
    <main className="flex-1 p-4 pb-32 overflow-y-auto">
      <LegalDocumentViewer />
    </main>
  );
}

export default function LegalDocumentPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <LegalDocHeader />
        {/* Suspense को यहाँ सबसे बाहर होना चाहिए */}
        <Suspense fallback={<div className="p-10 text-center">Loading Agreement...</div>}>
          <LegalContent />
        </Suspense>
        <BottomNavBar />
      </div>
    </div>
  );
}