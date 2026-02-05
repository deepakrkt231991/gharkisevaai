import { PropertyDetailPage } from '@/components/product-detail-page';

// यह लाइन Next.js को बताएगी कि इस पेज को लाइव लोड करना है
export const dynamic = "force-dynamic";

export default function PropertyDetail() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <PropertyDetailPage />
        </div>
    </div>
  );
}