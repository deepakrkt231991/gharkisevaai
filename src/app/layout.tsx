
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PwaLoader } from '@/components/pwa-loader';
import { PwaUpdateNotifier } from '@/components/pwa-update-notifier';
import { FloatingAiAssistant } from '@/components/floating-ai-assistant';
import Script from 'next/script';
import { InstallPwaBanner } from '@/components/install-pwa-banner';
import { Button } from '@/components/ui/button';


export const metadata: Metadata = {
  title: 'Ghar Ki Sevaai',
  description: '7% Fee, 100% Trust. The smartest way to Repair, Rent & Sell with AI.',
  manifest: '/manifest.json',
  authors: [{ name: 'Ghar Ki Sevaai', url: 'mailto:gharkisevaai@gmail.com' }],
  icons: {
    icon: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  }
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
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ghar Ki Sevaai" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <PwaLoader />
          <PwaUpdateNotifier />
          {children}
          <FloatingAiAssistant />
          <Toaster />
        </FirebaseClientProvider>
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
