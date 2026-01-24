
import { WorkerDashboard } from '@/components/worker-dashboard';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function WorkerDashboardPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <WorkerDashboard />
        <BottomNavBar />
      </div>
    </div>
  );
}
