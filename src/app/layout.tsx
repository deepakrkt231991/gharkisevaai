import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GrihSeva AI',
  description: 'Smartest way to Repair, Rent & Sell with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Button asChild className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 z-50">
            <Link href="/promote">
              <Gift className="h-8 w-8" />
              <span className="sr-only">Refer and Earn</span>
            </Link>
          </Button>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
