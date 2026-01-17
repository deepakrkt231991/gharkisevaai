'use client';

import { useState, useEffect } from 'react';

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
    isLoading: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by your browser.', isLoading: false }));
      return;
    }

    let isMounted = true;

    const onSuccess = (position: GeolocationPosition) => {
      if (isMounted) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      }
    };

    const onError = (error: GeolocationPositionError) => {
      if (isMounted) {
        setLocation(prev => ({ ...prev, error: error.message, isLoading: false }));
      }
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    return () => {
      isMounted = false;
    };
  }, []);

  return location;
};

    