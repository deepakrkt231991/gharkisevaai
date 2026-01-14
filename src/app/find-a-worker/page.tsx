import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WorkerCard } from '@/components/worker-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const workers = PlaceHolderImages.filter(img => img.id.startsWith('worker-'));

export default function FindWorkerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Find a Local Worker</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our list of verified and skilled local workers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
