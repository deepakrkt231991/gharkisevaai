'use client';

import { HomeHeader } from '@/components/home-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { WelcomeVideoModal } from '@/components/welcome-video-modal';
import { HomeCarouselBanner } from '@/components/home-carousel-banner';
import { LiveFeed } from '@/components/live-feed';

export default function Home() {
  return (
    <div className="dark bg-background text-foreground">
      <WelcomeVideoModal />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <HomeHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-32">
          <HomeCarouselBanner />
          <LiveFeed />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
