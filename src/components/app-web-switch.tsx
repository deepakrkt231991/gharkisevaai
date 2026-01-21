'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AppWebSwitch() {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // This check needs to be client-side only.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
        toast({ title: 'App Can Be Installed', description: 'Use your browser\'s menu to "Install App" or "Add to Home Screen".' });
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isStandalone ? (
             <Button onClick={() => window.open(window.location.href, '_blank')} variant="ghost" size="icon">
                <Globe className="h-5 w-5 text-white" />
                <span className="sr-only">Open in browser</span>
            </Button>
          ) : deferredPrompt ? (
             <Button onClick={handleInstallClick} variant="ghost" size="icon">
                <Download className="h-5 w-5 text-white" />
                <span className="sr-only">Install App</span>
            </Button>
          ) : null}
        </TooltipTrigger>
        <TooltipContent>
          {isStandalone ? <p>Open in Browser</p> : <p>Install App</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
