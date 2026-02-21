import InteriorAnalyzer from '@/components/interior-analyzer'; // ✅ No { } curly braces
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Home Consultant - Analysis',
  description: 'Realistic AI room and wall analysis with near worker booking',
};

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-24 bg-black">
        <InteriorAnalyzer />
      </main>
      
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}