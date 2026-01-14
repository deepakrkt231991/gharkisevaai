import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DefectAnalyzer } from '@/components/defect-analyzer';

export default function AnalyzePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">AI Defect Analyzer</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Upload an image of the home defect, and our AI will identify the issue and estimate repair costs in Hindi.
            </p>
          </div>
          <DefectAnalyzer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
