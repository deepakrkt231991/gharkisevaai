'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string; // This will be hardcoded to Mumbai for now
}

interface LocationTrackerProps {
    onLocationChange: (location: Location | null) => void;
}

export function LocationTracker({ onLocationChange }: LocationTrackerProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<'prompt' | 'loading' | 'granted' | 'denied'>('prompt');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check for stored location on mount
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(parsedLocation);
        setStatus('granted');
        onLocationChange(parsedLocation);
      } catch (e) {
        localStorage.removeItem('userLocation');
      }
    }
  }, [onLocationChange]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setStatus('denied');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // As per instructions, hardcode address for now. A real app would use a geocoding API.
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Mumbai, MH"
        };
        setLocation(userLocation);
        setStatus('granted');
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        onLocationChange(userLocation);
      },
      (error) => {
        setErrorMsg("Location access denied: " + error.message);
        setStatus('denied');
        onLocationChange(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  if (status === 'granted' && location) {
    return (
      <Card className="glass-card border-green-500/50">
        <CardContent className="p-3 text-center text-green-400 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16}/>
            <p className="font-bold text-white">Location Active</p>
          </div>
          <p className="text-sm font-bold text-white">{location.address} Detected</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'denied') {
      return (
         <Card className="glass-card border-destructive">
            <CardContent className="p-3 text-center text-destructive space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <AlertTriangle size={16}/>
                    <p className="font-bold text-white">Location Denied</p>
                </div>
                <p className="text-xs">{errorMsg}</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-3">
        <Button onClick={requestLocation} className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Detecting...</>
          ) : (
            <><MapPin className="mr-2 h-4 w-4"/>Enable Live Location</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
