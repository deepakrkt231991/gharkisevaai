import { Header } from '@/components/header';
import { PromoGenerator } from '@/components/promo-generator';

export default function PromotePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Share Your Referral QR Code</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Generate a personalized poster with your unique QR code. Share it with friends to earn a lifetime commission when they sign up!
            </p>
          </div>
          <PromoGenerator />
        </div>
      </main>
    </div>
  );
}
