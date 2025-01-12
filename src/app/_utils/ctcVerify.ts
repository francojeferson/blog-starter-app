"use client";

import React, { useEffect, useCallback } from "react";
import { rootUrl } from "@/lib/site-info";

interface SecureCheckProps {
  apiUrl?: string;
}

const CtcVerify: React.FC<SecureCheckProps> = ({
  apiUrl = "https://www.consumertrustcoalition.com/api/verify",
}) => {
  const verifyApi = useCallback(async () => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    const currentHostname = window.location.hostname;

    // Check if the current hostname ends with baseUrl
    if (!currentHostname.endsWith(rootUrl)) {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pathname: currentUrl,
          userAgent: window.navigator.userAgent,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: window.navigator.language,
          referrer: document.referrer,
        }),
      });

      const data = await response.json();

      if (data.redirect && data.url) {
        window.location.href = data.url;
      }
    } else {
      // do nothing
    }
  }, [apiUrl]);

  useEffect(() => {
    let isActive = true;

    const safelyExecuteVerifyApi = async () => {
      if (isActive) {
        try {
          await verifyApi();
        } catch (error) {
          //do nothing
        }
      }
    };

    safelyExecuteVerifyApi();

    const handlePopState = () => {
      safelyExecuteVerifyApi();
    };

    try {
      window.addEventListener("popstate", handlePopState);
    } catch (error) {
      // do nothing
    }

    return () => {
      isActive = false;
      try {
        window.removeEventListener("popstate", handlePopState);
      } catch (error) {
        // do nothing
      }
    };
  }, [verifyApi]);

  return null;
};

export default CtcVerify;
