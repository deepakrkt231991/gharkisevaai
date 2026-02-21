import InteriorAnalyzer from '@/components/interior-analyzer'; // यहाँ से { } हटा दिया है
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Home Consultant - Interior Analysis',
  description: 'Analyze wall defects with AI, get instant Mumbai repair quotes & book local painters',
};

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50">
      <main className="flex-1 pb-20"> 
        <InteriorAnalyzer />
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}