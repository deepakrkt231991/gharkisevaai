
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AppShell } from '@/components/app-shell';
import Script from 'next/script';
import { Button } from '@/components/ui/button';


export const metadata: Metadata = {
  title: 'Ghar Ki Seva',
  description: '7% Fee, 100% Trust. The smartest way to Repair, Rent & Sell with AI.',
  manifest: '/manifest.json',
  authors: [{ name: 'Ghar Ki Seva', url: 'mailto:gharkisevaai@gmail.com' }],
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
        <meta name="theme-color" content="#006970" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ghar Ki Seva" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <AppShell>
            {children}
          </AppShell>
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
