import { WorkerSignupPage } from '@/components/worker-signup-page';

// यह जादुई लाइन इस एरर को खत्म कर देगी
export const dynamic = "force-dynamic";

export default function WorkerSignup() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <WorkerSignupPage />
        </div>
    </div>
  );
}