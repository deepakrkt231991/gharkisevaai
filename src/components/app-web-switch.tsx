'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Globe, Wrench, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function AppWebSwitch() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  useEffect(() => {
    // This check needs to be client-side only.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevents the default mini-infobar or install dialog from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);

      // Show the install dialog if it hasn't been shown before
      const hasBeenPrompted = localStorage.getItem('pwaInstallPrompted');
      if (!hasBeenPrompted) {
        setShowInstallDialog(true);
        localStorage.setItem('pwaInstallPrompted', 'true');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // Hide the dialog if it's open
    setShowInstallDialog(false);
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
    }
  };

  const InstallDialog = () => (
     <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
      <DialogContent className="glass-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-white flex items-center gap-2">
             <Wrench className="h-6 w-6 text-primary"/>
            Install GrihSeva AI
          </DialogTitle>
          <DialogDescription>
            Get the full app experience. Add GrihSeva AI to your home screen for quick and easy access.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/><span className='text-white'>Faster performance and offline access.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/><span className='text-white'>Works just like a regular app.</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/><span className='text-white'>No browser bar, more screen space.</span></li>
            </ul>
        </div>
        <div className="flex flex-col gap-2">
            <Button onClick={handleInstallClick} className="w-full h-12">
                <Download className="mr-2 h-4 w-4"/> Install App
            </Button>
            <Button onClick={() => setShowInstallDialog(false)} variant="ghost" className="w-full">
                Maybe Later
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <>
      <InstallDialog />
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
