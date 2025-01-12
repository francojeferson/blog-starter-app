"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTracking } from "@/app/_context/TrackingContext"; // Adjust the import path as necessary
import { createJimmyKey } from "./jimmyKeyUtils";

interface CurrencyRates {
  [key: string]: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Global flag to prevent multiple simultaneous requests
let isRequestInProgress = false;

export function useCurrencyRates() {
  const { currencyRates, setCurrencyRates, lastUpdated, setLastUpdated } =
    useTracking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    // Check if a request is already in progress
    if (isRequestInProgress) {
      // console.log("A request is already in progress. Skipping this one.");
      return;
    }

    const now = new Date().getTime();
    if (
      currencyRates &&
      lastUpdated &&
      now - new Date(lastUpdated).getTime() < CACHE_DURATION
    ) {
      // console.log("Using cached currency rates.");
      return;
    }

    // Set the flag to true before starting the request
    isRequestInProgress = true;
    setLoading(true);

    try {
      // console.log("Fetching currency rates...");
      const response = await fetch("/api/utility/pull-currency-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({ message: "pull-currency-rates" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrencyRates(data.rates);
      setLastUpdated(data.lastUpdated);
      // console.log("Currency rates updated successfully.");
    } catch (e) {
      setError("Failed to fetch currency rates");
      console.error("Error fetching currency rates:", e);
    } finally {
      setLoading(false);
      // Reset the flag after the request is complete
      isRequestInProgress = false;
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, []);

  const convertCurrency = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string): number => {
      if (!currencyRates || fromCurrency === toCurrency) return amount;

      const fromRate = currencyRates[fromCurrency];
      const toRate = currencyRates[toCurrency];

      if (!fromRate || !toRate) {
        console.error(
          `Unable to convert from ${fromCurrency} to ${toCurrency}`
        );
        return amount;
      }

      return (amount / fromRate) * toRate;
    },
    [currencyRates]
  );

  return {
    rates: currencyRates,
    lastUpdated,
    loading,
    error,
    convertCurrency,
    refreshRates: fetchRates,
  };
}

export const countryToCurrency: { [key: string]: string } = {
  US: "USD",
  CA: "CAD",
  AU: "AUD",
  GB: "GBP",
  NZ: "NZD",
  FR: "EUR",
  DE: "EUR",
  IE: "EUR",
  IL: "ILS",
  DK: "DKK",
  NO: "NOK",
  SE: "SEK",
  IS: "ISK",
  FI: "EUR",
  // Add more country to currency mappings as needed
};

export const currencySymbols: { [key: string]: string } = {
  USD: "$",
  CAD: "CA$",
  AUD: "A$",
  GBP: "£",
  NZD: "NZ$",
  EUR: "€",
  ILS: "₪",
  DKK: "kr",
  NOK: "kr",
  SEK: "kr",
  ISK: "kr",
  // Add more currency symbols as needed
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

export const getCountryCurrency = (countryCode: string): string => {
  return countryToCurrency[countryCode] || "USD"; // Default to USD if country code not found
};

type CountryCode =
  | "US"
  | "CA"
  | "AU"
  | "GB"
  | "NZ"
  | "FR"
  | "DE"
  | "IE"
  | "IL"
  | "DK"
  | "NO"
  | "SE"
  | "IS"
  | "FI";
type Continent = "United States" | "International" | "Europe";

const continentMap: Record<CountryCode, Continent> = {
  US: "United States",
  CA: "International",
  AU: "International",
  GB: "Europe",
  NZ: "International",
  FR: "Europe",
  DE: "Europe",
  IE: "Europe",
  IL: "International",
  DK: "Europe",
  NO: "Europe",
  SE: "Europe",
  IS: "Europe",
  FI: "Europe",
};

export const mapCountryToContinent = (countryCode: CountryCode) => {
  return continentMap[countryCode] || "United States";
};
