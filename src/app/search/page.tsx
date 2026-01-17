import { HomeHeader } from '@/components/home-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <HomeHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for services, professionals, properties..."
                    className="w-full rounded-full bg-input pl-10 h-12"
                />
            </div>
            <div className="text-center py-16 text-muted-foreground">
                <SearchIcon className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">Search GrihSeva AI</h3>
                <p className="mt-1 text-sm">Find exactly what you need, from verified plumbers to luxury villas.</p>
            </div>
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
