import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WorkerSignupForm } from '@/components/worker-signup-form';

export default function WorkerSignupPage() {
  return (
    <div className="flex flex-col min-h-screen dark bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <WorkerSignupForm />
      </main>
      {/* Footer can be removed for a more app-like feel on this page if desired */}
      {/* <Footer /> */}
    </div>
  );
}
