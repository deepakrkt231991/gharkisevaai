'use client';

import React from 'react';

// हमने कॉम्पोनेंट इम्पोर्ट हटा दिया है ताकि एरर न आए
export const dynamic = "force-dynamic";

export default function WorkerSignup() {
  return (
    <div className="dark bg-background text-foreground min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
             <h1 className="text-2xl font-bold">Worker Signup</h1>
             <p className="text-muted-foreground">Registration coming soon...</p>
             <a href="/" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Back to Home
             </a>
        </div>
    </div>
  );
}