import { PropertyDetailPage } from '@/components/property-detail-page';

export default function PropertyDetail() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <PropertyDetailPage />
        </div>
    </div>
  );
}
