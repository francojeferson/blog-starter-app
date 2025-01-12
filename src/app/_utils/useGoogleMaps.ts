// hooks/useGoogleMaps.js
import { useState, useEffect } from "react";

export function useGoogleMaps() {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
    } else {
      const timer = setInterval(() => {
        if (window.google && window.google.maps) {
          setGoogleMapsLoaded(true);
          clearInterval(timer);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, []);

  return googleMapsLoaded;
}
