
import InteriorAnalyzer from '@/components/interior-analyzer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function InteriorAnalysisPage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/ai-help">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold font-headline text-center flex-1 pr-10">AI Fixit Consultant</h1>
            </header>
            <main className="flex-1">
                <InteriorAnalyzer />
            </main>
            <BottomNavBar />
        </div>
    </div>
  );
}
