import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WorkerCard } from '@/components/worker-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const doctors = PlaceHolderImages.filter(img => img.id.startsWith('worker-'));

export default function GetAdvicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Get Instant Advice</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our list of verified and skilled doctors and get instant medical advice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map(doctor => (
              <WorkerCard key={doctor.id} worker={doctor} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
