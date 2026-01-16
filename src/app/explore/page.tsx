import { ExploreMarketplace } from '@/components/explore-marketplace';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { MarketplaceHeader } from '@/components/marketplace-header';
import { FilterBar } from '@/components/filter-bar';

export default function ExplorePage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <MarketplaceHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
          <ExploreMarketplace />
        </main>
        <FilterBar />
        <BottomNavBar />
      </div>
    </div>
  );
}

    