
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

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-current"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/></svg>
);

function WhatsAppFAB() {
  const phoneNumber = '918291569096';
  const message = "Hello Ghar Ki Seva! I have a question about your services.";

  return (
    <div className="fixed bottom-[11rem] right-4 z-[99] group">
          <Button
            asChild
            size="icon"
            className="w-16 h-16 rounded-full bg-green-500 text-white shadow-2xl hover:bg-green-600 border-4 border-background transition-all transform-gpu group-hover:scale-110"
          >
          <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
            <WhatsAppIcon />
          </a>
        </Button>
    </div>
  );
}

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
          <WhatsAppFAB />
          <FloatingAiAssistant />
          <Toaster />
        </FirebaseClientProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4493898466896244"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
