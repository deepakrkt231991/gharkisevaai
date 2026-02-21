import InteriorAnalyzer from '@/components/interior-analyzer';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">
        <InteriorAnalyzer />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}