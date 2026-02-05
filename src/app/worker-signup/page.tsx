'use client';
import React, { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function WorkerSignup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold">Worker Signup</h1>
        <p className="text-muted-foreground mt-2">Join our service team. Registration opening soon.</p>
        <a href="/" className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md">Back to Home</a>
      </div>
    </Suspense>
  );
}