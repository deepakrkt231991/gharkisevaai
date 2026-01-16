import { ServiceSlotBooking } from '@/components/service-slot-booking';

export default function BookServicePage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background overflow-x-hidden">
             <ServiceSlotBooking />
        </div>
    </div>
  );
}
