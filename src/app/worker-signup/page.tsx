'use client';
import { WorkerSignupForm } from '@/components/worker-signup-page';
import { Suspense } from 'react';

export default function WorkerSignup() {
  return (
    <div className="dark bg-background text-foreground flex justify-center items-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <WorkerSignupForm />
      </Suspense>
    </div>
  );
}
