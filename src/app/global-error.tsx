'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="dark bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="glass-card max-w-md w-full p-8 rounded-xl">
                <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold font-headline text-white">An Error Occurred</h1>
                <p className="mt-2 text-muted-foreground">
                    We're sorry, but something went wrong. Please try again.
                </p>
                <Button onClick={() => reset()} className="mt-6 w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try again
                </Button>
            </div>
        </div>
      </body>
    </html>
  );
}
