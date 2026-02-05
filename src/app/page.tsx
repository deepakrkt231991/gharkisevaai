'use client';

import { Suspense } from 'react'; // 1. यहाँ Suspense इम्पोर्ट करें
import { HomeHeader } from '@/components/home-header';
// ... बाकी सारे इम्पोर्ट्स वैसे ही रहेंगे ...

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <div className="dark bg-background text-foreground">
        <WelcomeVideoModal />
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
          <HomeHeader />
          <main className="flex-1 space-y-8 overflow-y-auto p-4 pb-48">
            <UserStats />
            <HomeCarouselBanner />
            <AiServiceGrid />
            <SmartHub />
             <Card className="glass-card p-1 my-4">
                 <AdsenseBanner adSlot="2001427785" />
             </Card>
            <WhyChooseUsHome />
            <TrendingNow />
            <LiveFeed />
          </main>
          
          <InstallPwaBanner />
          <BottomNavBar />
        </div>
      </div>
    </Suspense>
  );
}