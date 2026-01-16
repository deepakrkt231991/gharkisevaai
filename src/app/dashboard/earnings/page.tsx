import { EarningsHub } from '@/components/earnings-hub';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function EarningsPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <EarningsHub />
        <BottomNavBar />
      </div>
    </div>
  );
}
