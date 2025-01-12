"use client";
// context/TrackingContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

interface CurrencyRates {
  [key: string]: number;
}

interface TrackingContextType {
  ffVid: string | null;
  setFfVid: (ffVid: string) => void;
  hitId: string | null;
  setHitId: (hitId: string) => void;
  currencyRates: CurrencyRates | null;
  setCurrencyRates: (rates: CurrencyRates) => void;
  lastUpdated: string | null;
  setLastUpdated: (date: string) => void;
}

interface StoredValue {
  value: string;
  expiry: number;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const setWithExpiry = (key: string, value: string) => {
  const item: StoredValue = {
    value: value,
    expiry: new Date().getTime() + EXPIRY_TIME,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key: string): string | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item: StoredValue = JSON.parse(itemStr);
  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export const TrackingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ffVid, setFfVid] = useState<string | null>(null);
  const [hitId, setHitId] = useState<string | null>(null);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const storedFfVid = getWithExpiry("ffVid");
    const storedHitId = getWithExpiry("hitId");
    const storedRates = getWithExpiry("currencyRates");
    const storedLastUpdated = getWithExpiry("lastUpdated");
    if (storedFfVid) setFfVid(storedFfVid);
    if (storedHitId) setHitId(storedHitId);
    if (storedRates) setCurrencyRates(JSON.parse(storedRates));
    if (storedLastUpdated) setLastUpdated(storedLastUpdated);
  }, []);

  useEffect(() => {
    if (ffVid) {
      setWithExpiry("ffVid", ffVid);
      // console.log("FF VID updated:", ffVid);
    }
  }, [ffVid]);

  useEffect(() => {
    if (hitId) {
      setWithExpiry("hitId", hitId);
      // console.log("Hit ID updated:", hitId);
    }
  }, [hitId]);

  useEffect(() => {
    if (currencyRates)
      setWithExpiry("currencyRates", JSON.stringify(currencyRates));
  }, [currencyRates]);

  useEffect(() => {
    if (lastUpdated) setWithExpiry("lastUpdated", lastUpdated);
  }, [lastUpdated]);

  const setFfVidCallback = useCallback((value: string) => {
    setFfVid(value);
  }, []);

  const setHitIdCallback = useCallback((value: string) => {
    setHitId(value);
  }, []);

  const setCurrencyRatesCallback = useCallback((value: CurrencyRates) => {
    setCurrencyRates(value);
  }, []);

  const setLastUpdatedCallback = useCallback((value: string) => {
    setLastUpdated(value);
  }, []);

  const contextValue = useMemo(
    () => ({
      ffVid,
      setFfVid: setFfVidCallback,
      hitId,
      setHitId: setHitIdCallback,
      currencyRates,
      setCurrencyRates: setCurrencyRatesCallback,
      lastUpdated,
      setLastUpdated: setLastUpdatedCallback,
    }),
    [
      ffVid,
      hitId,
      currencyRates,
      lastUpdated,
      setFfVidCallback,
      setHitIdCallback,
      setCurrencyRatesCallback,
      setLastUpdatedCallback,
    ]
  );

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = (): TrackingContextType => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }
  return context;
};
