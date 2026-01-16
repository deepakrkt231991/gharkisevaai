import { ExploreHeader } from '@/components/explore-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { AiServiceGrid } from '@/components/ai-service-grid';

export default function AiServicesPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <ExploreHeader />
        
        <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
            <div className="text-center">
                <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                <h1 className="font-headline text-2xl font-bold tracking-tight">What do you need help with?</h1>
            </div>
            <AiServiceGrid />
        </main>
        
        <BottomNavBar />
      </div>
    </div>
  );
}
