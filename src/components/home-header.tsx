'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, MapPin, Loader2 } from 'lucide-react';
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

export function HomeHeader() {
  const { latitude, error, isLoading } = useGeolocation();
  const [displayLocation, setDisplayLocation] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();


  useEffect(() => {
    // Priority: Manual Location > Geolocation > Fallback
    const storedLocation = localStorage.getItem('manualLocation');
    if (storedLocation) {
      setDisplayLocation(storedLocation);
      setManualLocationInput(storedLocation);
      return;
    }

    if (isLoading) {
      setDisplayLocation('Fetching...');
      return;
    }
    if (error) {
      setDisplayLocation("Location Disabled");
      return;
    }
    if (latitude) {
      // In a real app, you would use reverse geocoding here.
      // For now, we'll just show a generic "Near You".
      setDisplayLocation("Near You");
      return;
    }
    
    setDisplayLocation("New Delhi, India"); // Fallback
  }, [latitude, error, isLoading]);

  const handleLocationSave = async () => {
    if (manualLocationInput.trim()) {
      const newLocation = manualLocationInput.trim();
      setDisplayLocation(newLocation);
      localStorage.setItem('manualLocation', newLocation);

      // Save location to user's Firebase profile
      if (user && firestore) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          await updateDoc(userDocRef, {
            address: newLocation, // Using the 'address' field from the User entity
            location: { // Also save geo-coordinates if available
                latitude: latitude || null,
                longitude: longitude || null
            }
          });
        } catch (e) {
          console.error("Failed to save location to profile:", e);
        }
      }
      setIsLocationModalOpen(false);
    }
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
              {isLoading && displayLocation === 'Fetching...' ? (
                <span className="flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Fetching...</span>
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
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="location-input" className="text-white">
                Enter Location
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
