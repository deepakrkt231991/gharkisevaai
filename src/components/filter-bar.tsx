import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

export function FilterBar() {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 w-auto">
        <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-full shadow-lg p-2 flex items-center gap-2">
             <Button variant="ghost" className="rounded-full text-black dark:text-white">Budget & Type</Button>
             <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"/>
             <Button variant="ghost" className="rounded-full text-primary font-bold">
                 <SlidersHorizontal className="mr-2 h-4 w-4"/>
                 FILTERS
            </Button>
        </div>
    </div>
  );
}

    