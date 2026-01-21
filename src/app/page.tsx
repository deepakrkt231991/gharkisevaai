'use client';

import { HomeHeader } from '@/components/home-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { SeasonCheckCard } from '@/components/season-check-card';
import { TrendingNow } from '@/components/trending-now';
import { AiServiceGrid } from '@/components/ai-service-grid';
import { UserStats } from '@/components/user-stats';
import { WelcomeVideoModal } from '@/components/welcome-video-modal';

export default function Home() {
  return (
    <div className="dark bg-background text-foreground">
      <WelcomeVideoModal />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <HomeHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
          <SeasonCheckCard />
          <TrendingNow />
          <AiServiceGrid />
          <UserStats />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
