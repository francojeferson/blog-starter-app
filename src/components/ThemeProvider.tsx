"use client";

import { useEffect } from "react";

export function ThemeProvider() {
  useEffect(() => {
    // Handle dark mode on client-side only
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  return null;
}
