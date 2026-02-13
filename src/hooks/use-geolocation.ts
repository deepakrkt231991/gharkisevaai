'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false, // Start with false, as we might not fetch if manual location exists
  });

  const fetchLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by your browser.', isLoading: false }));
      return;
    }

    setLocation({ latitude: null, longitude: null, error: null, isLoading: true });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
        // Clear manual location on successful live detection
        localStorage.removeItem('manualLocation');
      },
      (error) => {
        setLocation(prev => ({ ...prev, latitude: null, longitude: null, error: error.message, isLoading: false }));
      }
    );
  }, []);

  // On initial mount, check for manual location or fetch live location
  useEffect(() => {
    const storedLocation = localStorage.getItem('manualLocation');
    if (!storedLocation) {
        fetchLocation();
    }
  }, [fetchLocation]);

  return { ...location, fetchLocation };
};
