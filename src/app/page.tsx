'use client';

import { HomeHeader } from '@/components/home-header';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { WelcomeVideoModal } from '@/components/welcome-video-modal';
import { HomeCarouselBanner } from '@/components/home-carousel-banner';
import { LiveFeed } from '@/components/live-feed';
import { AiServiceGrid } from '@/components/ai-service-grid';
import { SmartHub } from '@/components/smart-hub';
import { TrendingNow } from '@/components/trending-now';
import { UserStats } from '@/components/user-stats';
import { WhyChooseUsHome } from '@/components/why-choose-us-home';
import AdsenseBanner from '@/components/adsense-banner';
import { Card } from '@/components/ui/card';


export default function Home() {
  return (
    <div className="dark bg-background text-foreground">
      <WelcomeVideoModal />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <HomeHeader />
        <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-48">
          <UserStats />
          <HomeCarouselBanner />
          <AiServiceGrid />
          <SmartHub />
          <Card className="glass-card p-2">
            <AdsenseBanner adSlot="2001427785" />
          </Card>
          <WhyChooseUsHome />
          <TrendingNow />
          <LiveFeed />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
}
