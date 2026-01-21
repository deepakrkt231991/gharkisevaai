'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

export function WelcomeVideoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA) and if welcome has been shown
    const isPwa = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenWelcome = localStorage.getItem('hasSeenPwaWelcome');
    
    if (isPwa && !hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
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
          <DialogDescription className="pt-2 text-muted-foreground">
            अब आपकी हर घर-सेवा और खरीद-बिक्री 100% सुरक्षित है। हमने आपके लिए AI Consultant और Safe Vault तैयार कर दिया है। चलिए, अपना पहला अनुभव शुरू करें!
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
