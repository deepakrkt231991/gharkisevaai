import dynamic from 'next/dynamic';
import { BottomNavBar } from '@/components/bottom-nav-bar';

const InteriorAnalyzer = dynamic(() => import('@/components/interior-analyzer'), {
  ssr: false,
  loading: () => <div className="h-screen bg-black flex items-center justify-center text-blue-400 font-bold animate-pulse">Scanning...</div>
});

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 pb-24">
        <InteriorAnalyzer />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
