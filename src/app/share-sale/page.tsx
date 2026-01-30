import { Header } from '@/components/header';
import { SalePosterGenerator } from '@/components/sale-poster-generator';

export default function ShareSalePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Share Your Success!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Just sold an item? Generate a cool poster to share on your WhatsApp Status and show your friends!
            </p>
          </div>
          <SalePosterGenerator />
        </div>
      </main>
    </div>
  );
}
