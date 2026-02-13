'use client';
import { useState, useEffect } from 'react';
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
  const { latitude, longitude, error, isLoading, fetchLocation } = useGeolocation();
  const [displayLocation, setDisplayLocation] = useState<string>('Detecting Location...');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  useEffect(() => {
    const storedLocation = localStorage.getItem('manualLocation');
    if (storedLocation) {
      setDisplayLocation(storedLocation);
      setManualLocationInput(storedLocation);
      return;
    }

    if (!isLoading) {
        if (latitude && longitude) {
            setDisplayLocation("Near You");
            setIsLocationModalOpen(false); // Close modal on successful detection
        } else if (error) {
            setDisplayLocation("Set Location");
            // Automatically open modal only if it's not already open and no location is set
            if (!localStorage.getItem('manualLocation')) {
                setIsLocationModalOpen(true);
            }
        } else {
            // This is the initial state before any location is determined
            setDisplayLocation("Detecting Location...");
        }
    }
  }, [isLoading, latitude, longitude, error]);

  const handleLocationSave = async () => {
    if (manualLocationInput.trim()) {
      const newLocation = manualLocationInput.trim();
      setDisplayLocation(newLocation);
      localStorage.setItem('manualLocation', newLocation);

      if (user && firestore) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          await updateDoc(userDocRef, {
            address: newLocation,
          });
           toast({
            title: "Location Saved!",
            description: `Your location has been set to ${newLocation}.`,
          });
        } catch (e) {
          console.error("Failed to save location to profile:", e);
           toast({
            title: "Save Failed",
            description: "Could not save location to your profile.",
            variant: "destructive"
          });
        }
      }
      setIsLocationModalOpen(false);
    }
  };
  
  const handleLiveLocationClick = () => {
    toast({ title: 'Detecting live location...' });
    fetchLocation();
  };

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
              {isLoading ? (
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
            <DialogTitle className="font-headline text-2xl text-white">Change Location</DialogTitle>
            <DialogDescription>
               Enter your area or city to find services near you.
            </DialogDescription>
          </DialogHeader>

           {error && (
                <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Live Location Failed</AlertTitle>
                    <AlertDescription>
                        {error} Please enable location access for this site in your browser settings or enter your location manually.
                    </AlertDescription>
                </Alert>
            )}

            <div className="py-4 space-y-4">
                <Button onClick={handleLiveLocationClick} variant="outline" className="w-full h-12 text-base">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LocateFixed className="mr-2 h-4 w-4" />}
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
                    placeholder="e.g., Koramangala, Bangalore"
                    className="bg-input border-border-dark text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSave()}
                />
                </div>
            </div>
          <DialogFooter>
            <Button onClick={handleLocationSave} className="w-full">Save Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
