
import { Suspense } from 'react';
import { ExploreMarketplace } from '@/components/explore-marketplace';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { MarketplaceHeader } from '@/components/marketplace-header';
import { FilterBar } from '@/components/filter-bar';
import { Skeleton } from '@/components/ui/skeleton';

function ExploreMarketplaceFallback() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-14 w-full" />
            <div className="pt-6 space-y-6">
                <Skeleton className="h-40 w-full" />
                <div className="space-y-4">
                     <Skeleton className="h-8 w-1/2" />
                     <div className="space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-60 w-full rounded-2xl" />
                            <div className="flex justify-around">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                         <div className="space-y-3">
                            <Skeleton className="h-60 w-full rounded-2xl" />
                             <div className="flex justify-around">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ExplorePage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <MarketplaceHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
          <Suspense fallback={<ExploreMarketplaceFallback />}>
            <ExploreMarketplace />
          </Suspense>
        </main>
        <FilterBar />
        <BottomNavBar />
      </div>
    </div>
  );
}
