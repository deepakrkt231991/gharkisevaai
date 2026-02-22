
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Lightbulb, MessageSquare, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { AiChatBox } from './ai-chat-box';

const pageTips: Record<string, { title: string; tip: string }> = {
  '/ai-help': {
    title: 'AI Assistant Hub',
    tip: 'This is your creative center. Use our AI tools to analyze defects, design rooms, or create promotional videos.',
  },
  '/list-item': {
    title: 'Listing Tip',
    tip: 'Clear photos in good lighting can increase your sale price by up to 15%. Make sure to show any defects.',
  },
  '/list-property': {
    title: 'Listing Tip',
    tip: 'A video walkthrough can double the engagement on your property listing. Show the morning light!',
  },
  '/product-detail': {
    title: 'Buyer Tip',
    tip: "Check the seller's rating and reviews. Using the 'Reserve' feature secures your item with buyer protection.",
  },
  '/property-detail': {
    title: 'Buyer Tip',
    tip: "Use the 'AI Legal Help' to understand all terms before making a commitment. It's free!",
  },
  '/worker-signup': {
    title: 'Profile Tip',
    tip: 'Complete AI Verification to get a "Verified" badge. Verified workers get 3x more job requests.',
  },
  '/find-a-worker': {
    title: 'Booking Tip',
    tip: "A worker with a high rating and many completed jobs is a safe choice. You can chat with them for free before booking.",
  },
  '/analyze': {
      title: 'Analysis Tip',
      tip: "For best results, upload a clear, well-lit photo or a short video of the problem area. More detail helps the AI give a more accurate estimate."
  }
};

export function FloatingAiAssistant() {
  const pathname = usePathname();
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tip, setTip] = useState<{ title: string; tip: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Find the tip for the current path, including sub-paths
    const currentTipKey = Object.keys(pageTips).find(key => pathname.startsWith(key));
    const currentTip = currentTipKey ? pageTips[currentTipKey] : null;

    if (currentTip) {
      setTip(currentTip);
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsTipOpen(true);
      }, 1500);
      
      const closeTimer = setTimeout(() => {
          setIsTipOpen(false);
      }, 6500);

      return () => {
          clearTimeout(timer);
          clearTimeout(closeTimer);
      };

    } else {
      setIsVisible(false);
      setIsTipOpen(false);
      setTip(null);
    }
  }, [pathname]);


  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2">
        <AnimatePresence>
          {isTipOpen && tip && (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                  <Card className="w-72 glass-card border-primary/30 shadow-2xl shadow-primary/10">
                      <CardHeader className="p-3 flex-row items-start justify-between">
                          <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-primary/10 rounded-full">
                                  <Lightbulb className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                  <CardTitle className="text-base font-headline text-white">{tip.title}</CardTitle>
                              </div>
                          </div>
                          <Button variant="ghost" size="icon" className="w-6 h-6 -mr-1 -mt-1" onClick={() => setIsTipOpen(false)}>
                              <X className="w-4 h-4"/>
                          </Button>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                          <p className="text-sm text-muted-foreground">{tip.tip}</p>
                      </CardContent>
                  </Card>
              </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
          <Button
              size="icon"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/20 border-4 border-background"
          >
              {isChatOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
          </Button>
        </motion.div>
      </div>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-44 right-4 z-[100] w-80 h-[28rem] bg-card/80 backdrop-blur-lg border border-border rounded-2xl shadow-2xl flex flex-col"
          >
             <header className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold font-headline text-white">AI Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setIsChatOpen(false)}>
                    <X className="w-4 h-4" />
                </Button>
            </header>
            <AiChatBox />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
