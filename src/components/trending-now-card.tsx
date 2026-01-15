"use client";

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { AppSettings } from '@/lib/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-message-circle"
  >
    <path d="M12.9 2.2c-5.5 0-10 3.8-10 8.5 0 2.4 1.2 4.6 3.1 6.1L3.1 22l4.1-1.3c1.5.8 3.2 1.2 5 1.2 5.5 0 10-3.8 10-8.5S18.4 2.2 12.9 2.2z" fill="#25D366" />
    <path
      d="M8.4 7.6c.1-.3.3-.5.5-.6.2-.1.4-.1.6 0 .2 0 .4.1.6.3s.3.4.4.6c.1.2.1.4 0 .6-.1.2-.2.4-.4.5l-.5.3c-.2.1-.4.2-.6.3-.2.1-.3.2-.4.3 0 .1-.1.2-.1.3v.1c.1.2.2.3.4.4l.7.4c.2.1.4.2.6.3.2.1.4.2.6.3.2.1.4.2.5.4s.2.4.2.6-.1.4-.2.6c-.1.2-.3.3-.5.4-.2.1-.5.1-.7 0l-1.1-.6c-.2-.1-.4-.2-.5-.4-.1-.1-.2-.3-.3-.4 0-.1.1-.2.2-.4l.2-.2c.1 0 .1-.1.1-.2 0-.1 0-.1-.1-.2l-1.2-.7c-.2-.1-.4-.2-.5-.4s-.2-.4-.1-.6z"
      fill="white"
    />
  </svg>
);


export function TrendingNowCard() {
  const firestore = useFirestore();

  const bannerDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    // This card will use a different document, e.g., 'trending_post'
    return doc(firestore, 'app_settings', 'trending_post');
  }, [firestore]);

  const { data: bannerData, isLoading } = useDoc<AppSettings>(bannerDocRef);

  const parsedContent = useMemo(() => {
    // Let's use a default cricket-themed post for demonstration
    const defaultContent = "Vir Kohli ki batting aur GrihSeva AI ki service—Dono hi World Class! 🏏 AC ki servicing karwayein aur doston ko jodein, 0.05% commission ke liye!\nVirat Kohli's batting and GrihSeva AI's service—both are World Class! 🏏 Get your AC serviced and refer friends for a 0.05% commission!";
    const content = bannerData?.content || defaultContent;

    const parts = content.split('\n').filter(p => p.trim() !== '');
    const hindi = parts.find(p => /[\u0900-\u097F]/.test(p)) || '';
    const english = parts.find(p => !/[\u0900-\u097F]/.test(p)) || '';

    if (parts.length > 1 && (!hindi || !english)) {
      return { hindi: parts[0], english: parts.slice(1).join(' ') };
    }

    return { hindi, english };
  }, [bannerData]);

  const handleShare = () => {
    const text = `${parsedContent.hindi}\n\n${parsedContent.english}\n\nDownload GrihSeva AI Now!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };


  if (isLoading) {
    return (
        <Card className="bg-secondary/50">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }

  const baseColor = bannerData?.backgroundColor || '#00A8E8'; // Neon Blue

  return (
    <Card 
      className="shadow-lg animate-pulse-slow border-2"
      style={{
        borderColor: baseColor,
        boxShadow: `0 0 15px ${baseColor}60, 0 0 5px ${baseColor}A0`,
        backgroundColor: `${baseColor}15`, // ~8% opacity
      }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: baseColor }}>
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            {parsedContent.hindi && <p className="font-bold text-lg" style={{color: baseColor}}>{parsedContent.hindi}</p>}
            {parsedContent.english && <p className="text-sm text-muted-foreground">{parsedContent.english}</p>}
          </div>
           <Button onClick={handleShare} className="bg-green-500 text-white hover:bg-green-600 flex-shrink-0">
             <WhatsAppIcon />
             Share on WhatsApp
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom animation in globals.css if needed, or extend tailwind.config
// For now, a slow pulse can be added to tailwind.config.ts if desired.
// For simplicity, we can use a standard pulse or no animation.
// I added a temporary `animate-pulse-slow` class name as a placeholder.
