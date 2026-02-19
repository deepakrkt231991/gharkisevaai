

'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, MapPin, Loader2, AlertCircle, LocateFixed } from 'lucide-react';
import { AppWebSwitch } from './app-web-switch';
import { useGeolocation } from '@/hooks/use-geolocation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


export function HomeHeader() {
  const router = useRouter();
  const { latitude, longitude, error, isLoading: isGeoLoading, fetchLocation } = useGeolocation();
  const [displayLocation, setDisplayLocation] = useState<string>('Detecting Location...');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setDisplayLocation(storedLocation);
      setManualLocationInput(storedLocation);
      setIsLocationModalOpen(false); // Close modal if location exists
      return; 
    }

    if (isGeoLoading) {
      setDisplayLocation("Detecting...");
    } else if (latitude && longitude) {
      setDisplayLocation("Near You");
      if(isLocationModalOpen) setIsLocationModalOpen(false);
    } else if (error) {
      setDisplayLocation("Set Location");
      setIsLocationModalOpen(true);
    }
  }, [isGeoLoading, latitude, longitude, error, isLocationModalOpen]);

  const handleLocationSave = () => {
    if (!manualLocationInput.trim()) return;
    localStorage.setItem('userLocation', manualLocationInput.trim());
    window.location.href = '/'; // Force a full page reload to re-evaluate everything
  };
  
  const handleLiveLocationClick = useCallback(() => {
    localStorage.removeItem('userLocation');
    fetchLocation();
  }, [fetchLocation]);

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
        <button className="flex items-center gap-2 text-left" onClick={() => setIsLocationModalOpen(true)}>
          <MapPin className="h-6 w-6 text-primary" />
          <div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              Your Location <ChevronDown className="h-3 w-3" />
            </div>
            <p className="font-bold text-foreground">
              {isGeoLoading && !localStorage.getItem('userLocation') ? ( 
                <span className="flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Detecting...</span>
              ) : (
                displayLocation
              )}
            </p>
          </div>
        </button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
          </Button>
          <AppWebSwitch />
        </div>
      </header>

      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="glass-card sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-white">Set Your Location</DialogTitle>
            <DialogDescription>
               Enable live location for the best experience or enter your area manually.
            </DialogDescription>
          </DialogHeader>

           {error && (
                <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Live Location Failed</AlertTitle>
                    <AlertDescription>
                        {error} Please enable location in your browser settings to use this feature.
                    </AlertDescription>
                    <Button onClick={handleLiveLocationClick} variant="outline" className="w-full mt-2 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">Try Again</Button>
                </Alert>
            )}

            <div className="py-4 space-y-4">
                <Button onClick={handleLiveLocationClick} variant="outline" className="w-full h-12 text-base" disabled={isGeoLoading}>
                    {isGeoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LocateFixed className="mr-2 h-4 w-4" />}
                    Use Live Location
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="location-input" className="text-white">
                    Enter Location Manually
                </Label>
                <Input
                    id="location-input"
                    value={manualLocationInput}
                    onChange={(e) => setManualLocationInput(e.target.value)}
                    placeholder="e.g., Kalyan, Mumbai"
                    className="bg-input border-border-dark text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSave()}
                />
                </div>
            </div>
          <DialogFooter className="sm:justify-start flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button onClick={handleLocationSave} className="w-full" disabled={!manualLocationInput.trim()}>
              Save & Continue
            </Button>
            <Button onClick={() => setIsLocationModalOpen(false)} variant="ghost" className="w-full">Skip for now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
