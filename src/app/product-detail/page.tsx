import { ProductDetailPage } from '@/components/product-detail-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProductDetailFallback() {
    return (
        <div className="flex flex-col h-screen bg-background p-4 space-y-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-14 w-full" />
        </div>
    );
}


export default function ProductDetail() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <Suspense fallback={<ProductDetailFallback />}>
                <ProductDetailPage />
            </Suspense>
        </div>
    </div>
  );
}
