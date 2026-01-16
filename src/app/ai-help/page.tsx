import { HomeHeader } from '@/components/home-header'; // Re-using for a consistent header feel
import { AiAssistanceHub } from '@/components/ai-help-hub';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function AiHelpPage() {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        {/* While the design shows a specific header, we can reuse and adapt for consistency */}
        <HomeHeader /> 
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
           <div className="text-left">
                <p className="text-xs text-primary font-bold">GRIHSEVA AI</p>
                <h1 className="font-headline text-2xl font-bold tracking-tight">AI Assistance Hub</h1>
            </div>
          <AiAssistanceHub />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
