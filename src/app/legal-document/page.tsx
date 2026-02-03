'use client'

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// हम कंपोनेंट को इतना 'Lazy' बना देंगे कि बिल्ड के समय एरर आ ही न सके
const LegalDocumentViewer = dynamic(
  () => import('@/components/legal-document-viewer').then(mod => mod.LegalDocumentViewer),
  { ssr: false, loading: () => <div className="p-10 text-center text-white">Initializing Secure Vault...</div> }
);

export default function LegalDocumentPage() {
  return (
    <div className="dark bg-background min-h-screen text-foreground">
      {/* सबसे बाहरी लेवल पर Suspense */}
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <div className="relative mx-auto flex w-full max-w-md flex-col">
          <main className="flex-1 p-4 pb-32">
            <LegalDocumentViewer />
          </main>
        </div>
      </Suspense>
    </div>
  );
}