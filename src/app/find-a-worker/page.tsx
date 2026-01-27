'use client';

import { ExploreHeader } from '@/components/explore-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { ProfessionalCard } from '@/components/professional-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Wrench, Zap, Paintbrush } from 'lucide-react';
import Link from 'next/link';

export default function FindWorkerPage() {
    const workers = PlaceHolderImages.filter(img => img.specialty);
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <ExploreHeader />
        
        <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-32">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                <Button className="rounded-full bg-primary h-10 whitespace-nowrap"><Wrench size={16} className="mr-2"/> Plumbing</Button>
                <Button variant="secondary" className="rounded-full h-10 bg-card text-white whitespace-nowrap"><Zap size={16} className="mr-2"/> Electrical</Button>
                <Button variant="secondary" className="rounded-full h-10 bg-card text-white whitespace-nowrap"><Paintbrush size={16} className="mr-2"/> Painting</Button>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-headline text-white">Top Professionals</h2>
                    <Link href="/find-a-worker" className="text-sm font-bold text-primary">See All</Link>
                </div>
                <div className="space-y-4">
                    {workers.map((worker) => (
                        <ProfessionalCard key={worker.id} worker={worker} />
                    ))}
                </div>
            </div>
        </main>
        
        <BottomNavBar />
      </div>
    </div>
  );
}
