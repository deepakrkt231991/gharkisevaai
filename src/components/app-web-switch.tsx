'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Globe } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AppWebSwitch() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // This check needs to be client-side only.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevents the default mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // The prompt can only be used once.
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isStandalone ? (
              <Button onClick={() => window.open(window.location.href, '_blank')} variant="ghost" size="icon">
                  <Globe className="h-5 w-5 text-white" />
                  <span className="sr-only">Open in browser</span>
              </Button>
            ) : deferredPrompt ? ( // Only show install button if it's possible to install
              <Button onClick={handleInstallClick} variant="ghost" size="icon">
                  <Download className="h-5 w-5 text-white" />
                  <span className="sr-only">Install App</span>
              </Button>
            ) : null }
          </TooltipTrigger>
          <TooltipContent>
            {isStandalone ? <p>Open in Browser</p> : <p>Install App</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
