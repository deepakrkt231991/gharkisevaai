
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
    isLoading: true, // Start loading immediately to reflect the initial check.
  });

  const fetchLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocation({ latitude: null, longitude: null, error: 'Geolocation is not supported by your browser.', isLoading: false });
      return;
    }

    setLocation(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
        localStorage.removeItem('userLocation');
      },
      (error) => {
        let errorMessage = 'An unknown error occurred.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        setLocation({ latitude: null, longitude: null, error: errorMessage, isLoading: false });
      },
      { timeout: 10000, enableHighAccuracy: true } // Add a timeout and request high accuracy
    );
  }, []);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
        // If manual location exists, we are not loading and have no error.
        // We don't have lat/lon, but the display will use the manual string.
        setLocation({ latitude: null, longitude: null, error: null, isLoading: false });
    } else {
        fetchLocation();
    }
  }, [fetchLocation]);

  return { ...location, fetchLocation };
};
