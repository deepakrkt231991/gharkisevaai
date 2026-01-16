
import { InteriorAnalyzer } from '@/components/interior-analyzer';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function InteriorAnalysisPage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background-dark overflow-x-hidden">
             <InteriorAnalyzer />
             <BottomNavBar />
        </div>
    </div>
  );
}
