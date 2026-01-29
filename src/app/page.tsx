
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
          <WhyChooseUsHome />
          <TrendingNow />
          <LiveFeed />
        </main>
        
        {/* Sticky Ad Banner */}
        <div className="fixed bottom-20 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-2">
            <Card className="glass-card p-1">
                <AdsenseBanner adSlot="2001427785" />
            </Card>
        </div>

        <BottomNavBar />
      </div>
    </div>
  );
}
