'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Home, Sparkles } from 'lucide-react';

export function WelcomeVideoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the modal if the user hasn't seen it before.
    const hasSeenWelcome = localStorage.getItem('hasSeenPwaWelcome');
    
    if (!hasSeenWelcome) {
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
            <Home /> नमस्ते! Ghar Ki Seva में आपका स्वागत है। 🏠✨
          </DialogTitle>
          <DialogDescription className="pt-4 text-muted-foreground space-y-4">
            <p>
                अब आपकी हर घर-सेवा और खरीद-बिक्री 100% सुरक्षित है। हमने आपके लिए AI Consultant और Safe Vault तैयार कर दिया है।
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
