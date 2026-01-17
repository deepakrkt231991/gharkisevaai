import { ExploreHeader } from '@/components/explore-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { AiServiceGrid } from '@/components/ai-service-grid';

export default function FindWorkerPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <ExploreHeader />
        
        <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
            <AiServiceGrid />
        </main>
        
        <BottomNavBar />
      </div>
    </div>
  );
}
