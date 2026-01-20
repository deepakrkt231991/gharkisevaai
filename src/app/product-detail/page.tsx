import { ProductDetailPage } from '@/components/product-detail-page';

export default function ProductDetail() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <ProductDetailPage />
        </div>
    </div>
  );
}
