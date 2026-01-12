import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WorkerCard } from '@/components/worker-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdviceForm } from '@/components/advice-form';

const doctors = PlaceHolderImages.filter(img => img.id.startsWith('worker-'));

export default function GetAdvicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Get Medical Advice</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get instant AI-powered advice or connect with one of our verified doctors.
            </p>
          </div>
          <Tabs defaultValue="instant-advice" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instant-advice">Get Instant Advice</TabsTrigger>
              <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
            </TabsList>
            <TabsContent value="instant-advice">
              <AdviceForm />
            </TabsContent>
            <TabsContent value="find-doctor">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {doctors.map(doctor => (
                  <WorkerCard key={doctor.id} worker={doctor} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}