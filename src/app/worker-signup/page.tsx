import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WorkerSignupForm } from '@/components/worker-signup-form';

export default function WorkerSignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Join GHAR KI SEVA AI as a Professional</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Register yourself as a skilled worker and start getting jobs in your area.
            </p>
          </div>
          <WorkerSignupForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
