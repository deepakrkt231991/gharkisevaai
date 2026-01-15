// src/app/list-tool/page.tsx
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ListToolForm } from '@/components/list-tool-form';

export default function ListToolPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">List Your Tool for Rent</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Earn extra income by renting out your tools to other professionals in the GrihSeva AI community.
            </p>
          </div>
          <ListToolForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
