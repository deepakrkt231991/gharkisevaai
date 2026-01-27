import { SellerDashboard } from '@/components/seller-dashboard';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function SellerDashboardPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <SellerDashboard />
        <BottomNavBar />
      </div>
    </div>
  );
}
