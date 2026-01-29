
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PwaLoader } from '@/components/pwa-loader';
import { PwaUpdateNotifier } from '@/components/pwa-update-notifier';
import { FloatingAiAssistant } from '@/components/floating-ai-assistant';


export const metadata: Metadata = {
  title: 'Ghar Ki Seva (AI Verified)',
  description: '7% Fee, 100% Trust. The smartest way to Repair, Rent & Sell with AI.',
  manifest: '/manifest.json',
  authors: [{ name: 'Ghar Ki Seva AI', url: 'mailto:gharkisevaai@gmail.com' }],
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
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#006970" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GrihSeva AI" />
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <PwaLoader />
          <PwaUpdateNotifier />
          {children}
          <FloatingAiAssistant />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
