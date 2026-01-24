'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Sparkles, Download } from 'lucide-react';

export function WelcomeVideoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if running as a PWA (standalone) and if the user hasn't seen it before.
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenWelcome = localStorage.getItem('hasSeenPwaWelcome');
    
    if (isStandalone && !hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    // Set the flag in localStorage so it doesn't show again.
    localStorage.setItem('hasSeenPwaWelcome', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-white flex items-center gap-2">
            <Download className="text-accent"/> ऐप में आपका स्वागत है!
          </DialogTitle>
          <DialogDescription className="pt-4 text-sm text-muted-foreground space-y-4">
            <p>
                Ghar Ki Seva को अपनी होम स्क्रीन पर जोड़ने के लिए धन्यवाद! अब आप ऑफ़लाइन रहते हुए भी ऐप का उपयोग कर सकते हैं और तेज़ अनुभव का आनंद ले सकते हैं।
            </p>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                <p className="font-bold text-accent flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" /> लाइफटाइम कमाई!</p>
                <p className="text-white">हर रेफरल पर 0.05% कमीशन पाएं।</p>
            </div>
            <p>चलिए, अपना पहला अनुभव शुरू करें!</p>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
            <Button onClick={handleClose} className="w-full">
                Get Started
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
