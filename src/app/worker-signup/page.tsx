'use client';
import React, { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function WorkerSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="dark bg-background text-foreground min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Worker Signup</h1>
          <p className="text-muted-foreground">Registration coming soon...</p>
          <a href="/" className="mt-4 inline-block text-blue-500 underline">Back to Home</a>
        </div>
      </div>
    </Suspense>
  );
}