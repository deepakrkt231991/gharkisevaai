'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';

export function WelcomeVideoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenVideo = localStorage.getItem('hasSeenWelcomeVideo');
    if (!hasSeenVideo) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomeVideo', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl glass-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-white flex items-center gap-2"><PlayCircle /> Welcome to Ghar Ki Seva AI!</DialogTitle>
          <DialogDescription>
            Watch this quick 1-minute guide to understand how our secure marketplace works.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mt-4">
          {/* In a real app, replace this with your actual video file or an embed */}
          <video
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" // Placeholder video
            controls
            autoPlay
            muted
            loop
            className="w-full h-full"
          />
        </div>
        <div className="mt-4">
            <Button onClick={handleClose} className="w-full">
                Get Started
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
