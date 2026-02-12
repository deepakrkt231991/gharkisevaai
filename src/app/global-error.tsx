'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-blue-50">
          <h1 className="text-3xl font-bold font-headline text-blue-900">Oops! Kuch Problem Hui 🛠️</h1>
          <p className="mt-2 text-gray-600">
            Hum ise theek kar rahe hain. Kirpaya niche diye button par click karein.
          </p>
          <Button 
            onClick={() => reset()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold h-auto text-base hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            App Refresh Karein
          </Button>
        </div>
      </body>
    </html>
  );
}
