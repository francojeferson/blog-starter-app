"use client";
import React, { useState, useEffect } from "react";
import useEfClickId from "@/app/_utils/useEfClickId";
import useMixpanelId from "@/app/_utils/useMixpanelId";

const CheckoutClickId = () => {
  const [isClient, setIsClient] = useState(false);
  const clickId = useEfClickId();
  const mixpanelId = useMixpanelId();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (clickId) {
        console.log("Checkout Page - Everflow Click Captured");
      }
      if (mixpanelId) {
        console.log("Checkout Page - Mixpanel ID Captured");
      }
    }
  }, [isClient, clickId, mixpanelId]);

  return null;
};

export default CheckoutClickId;
