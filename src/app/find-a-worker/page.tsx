import { ExploreHeader } from '@/components/explore-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { ProfessionalCard } from '@/components/professional-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Zap, Wrench, Paintbrush } from 'lucide-react';

const workers = PlaceHolderImages.filter(img => img.id.startsWith('worker-'));

const categories = [
    { name: 'Plumbing', icon: Wrench },
    { name: 'Electrical', icon: Zap },
    { name: 'Painting', icon: Paintbrush },
    { name: 'Cleaning', icon: Wrench }, // Placeholder, no icon for this yet
]


export default function FindWorkerPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <ExploreHeader />
        
        <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
            <div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button variant="secondary" className="rounded-full bg-primary text-primary-foreground">
                        <Wrench className="mr-2 h-4 w-4" /> Plumbing
                    </Button>
                    <Button variant="secondary" className="rounded-full bg-surface-dark text-white">
                        <Zap className="mr-2 h-4 w-4" /> Electrical
                    </Button>
                    <Button variant="secondary" className="rounded-full bg-surface-dark text-white">
                        <Paintbrush className="mr-2 h-4 w-4" /> Painting
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-headline">Top Professionals</h2>
                <button className="text-sm font-bold text-primary">See All</button>
            </div>

            <div className="space-y-4">
                {workers.map(worker => (
                    <ProfessionalCard key={worker.id} worker={worker} />
                ))}
            </div>
        </main>
        
        {/* I'm using the main BottomNavBar for consistency. The design shows a different one, but it's better to be consistent. */}
        <BottomNavBar />
      </div>
    </div>
  );
}
