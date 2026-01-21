'use client';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, MapPin, Loader2 } from 'lucide-react';
import { AppWebSwitch } from './app-web-switch';
import { useGeolocation } from '@/hooks/use-geolocation';

export function HomeHeader() {
  const { latitude, error, isLoading } = useGeolocation();

  const getLocationText = () => {
    if (isLoading) {
      return <span className="flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Fetching...</span>;
    }
    if (error) {
      return "Location Disabled";
    }
    if (latitude) {
      return "Near You"; // Simple text, no reverse geocoding
    }
    return "New Delhi, India"; // Fallback
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Your Location <ChevronDown className="h-3 w-3" />
          </div>
          <p className="font-bold text-foreground">{getLocationText()}</p>
        </div>
      </div>
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
  );
}
