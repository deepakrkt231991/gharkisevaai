
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AiHelpHub } from '@/components/ai-help-hub';

export default function AiHelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">AI-Powered Assistance Hub</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Unlock the power of AI for your home and business. Choose a task below and let our AI agents assist you.
            </p>
          </div>
          <AiHelpHub />
        </div>
      </main>
      <Footer />
    </div>
  );
}
