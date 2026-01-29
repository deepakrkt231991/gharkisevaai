'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasBeenDismissed = sessionStorage.getItem('pwaInstallBannerDismissed');
    
    if (isStandalone || hasBeenDismissed) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwaInstallBannerDismissed', 'true');
    setIsVisible(false);
  };
  
  if (!isVisible) {
      return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-24 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
    >
      <Card className="glass-card p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="font-semibold text-white">बेहतर अनुभव के लिए ऐप इंस्टॉल करें!</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button onClick={handleInstallClick} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
            <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-8 w-8 text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
