'use client';
import { WorkerSignupForm } from '@/components/worker-signup-page';

export default function WorkerSignupPage() {
  return (
    <div className="dark bg-background text-foreground flex items-center justify-center min-h-screen">
      <WorkerSignupForm />
    </div>
  );
}
