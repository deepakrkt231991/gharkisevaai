'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

export function PwaUpdateNotifier() {
  const { toast } = useToast();
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null);
  const [isUpdateReady, setIsUpdateReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update available
                  setNewWorker(installingWorker);
                  setIsUpdateReady(true);
                }
              });
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isUpdateReady) {
      toast({
        title: "New Features Added!",
        description: "Refresh the app to get the latest updates.",
        duration: 100000,
        action: (
          <Button onClick={() => {
            if (newWorker) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        ),
      });
    }
  }, [isUpdateReady, toast, newWorker]);
  
  // Reload page on controller change
  useEffect(() => {
      let refreshing = false;
      if ('serviceWorker' in navigator) {
          const onControllerChange = () => {
              if (refreshing) return;
              refreshing = true;
              window.location.reload();
          };
          navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

          return () => {
              navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          };
      }
  }, []);

  return null;
}
