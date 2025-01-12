"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/app/_context/SessionContext";
import { baseUrl } from "@/lib/site-info";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import useCheckStep from "@/app/_utils/checkCheckoutStep";
import useEfClickId from "@/app/_utils/useEfClickId";
import useMixpanelId from "@/app/_utils/useMixpanelId";
import { useTracking } from "@/app/_context/TrackingContext";
import { createJimmyKey } from "@/app/_utils/jimmyKeyUtils";
import { ProductInfoType } from "@/interfaces/productInfo";

type Cookies = { [key: string]: string };

type HandleSessionStartProps = {
  info: CheckoutPageType;
  setCustomerInfo: React.Dispatch<React.SetStateAction<any>>;
  product: ProductInfoType;
};

const HandleSessionStartContent = ({
  info,
  setCustomerInfo,
  product,
}: HandleSessionStartProps) => {
  const [sessionGrabbed, setSessionGrabbed] = useState(false);
  const [sessionStartAttempted, setSessionStartAttempted] = useState(false);
  const clickId = useEfClickId();
  const mixpanel_id = useMixpanelId();

  useEffect(() => {
    if (clickId) {
      console.log("Checkout Page - Everflow Click Captured");
    }
    if (mixpanel_id) {
      console.log("Checkout Page - Mixpanel ID Captured");
    }
  }, [clickId, mixpanel_id]);

  const searchParams = useSearchParams();
  const { sessionId, setSessionId } = useSession();
  const { ffVid, hitId } = useTracking();
  const checkStep = useCheckStep();

  const extractValueFromCookie = (cookies: Cookies, cookieName: string) => {
    const cookieValue = cookies[cookieName] || "";
    if (cookieValue) {
      // For VWO UUID cookies (any cookie starting with _vwo_uuid)
      if (cookieName.startsWith("_vwo_uuid")) {
        return cookieValue; // Return the full value for VWO UUID cookies
      }
      if (cookieName === "_clsk") {
        return getClarityUserId(cookieValue);
      }
      // For other cookies, use the existing logic
      const matches = cookieValue.match(/^.+\.(.+?\..+?)$/);
      return matches ? matches[1] : "";
    }
    return "";
  };

  const getClarityUserId = (cookieValue: string) => {
    // Decode the URL-encoded cookie value
    const decodedValue = decodeURIComponent(cookieValue);

    // Split the decoded string by '|' and take the first element
    const userId = decodedValue.split("|")[0];

    return userId;
  };

  const startSession = async (params: Record<string, string>) => {
    if (sessionId || sessionStartAttempted) return;
    setSessionStartAttempted(true);
    try {
      // console.log("Starting session with params: ", params);
      const response = await fetch("/api/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sessionStart = await response.json();
      // console.log("Session Start Response: ", sessionStart);
      const newSessionId = sessionStart.sessionId;
      setCustomerInfo((prevInfo: any) => ({
        ...prevInfo,
        sessionId: newSessionId,
      }));
      setSessionId(newSessionId);
    } catch (error) {
      setSessionStartAttempted(false);
      const reportError = await fetch("/api/utility/send-slack-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({
          message: "Error - Failed to Start Session  - Checkout Page",
          errorDetails: "Failed to Start Session - Checkout Page",
          userInfo: { sessionId },
        }),
      });
      console.error("Error starting session:", error);
    }
  };

  const fetchSessionData = async (sessionId: string) => {
    if (sessionGrabbed) return;
    setSessionGrabbed(true);
    try {
      if (!sessionId) return;

      const customerData = await checkStep({
        sessionId,
        pageStep: 0,
      });
      setCustomerInfo((prevInfo: any) => ({
        ...prevInfo,
        ...customerData,
      }));
    } catch (error) {
      const reportError = await fetch("/api/utility/send-slack-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({
          message: "Error - Failed to Fetch Session Data - Checkout Page",
          errorDetails: "No Session Data Found - Checkout Page",
          userInfo: { sessionId },
        }),
      });
      console.error("Error fetching session:", error);
    }
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Extract cookies on the client-side
    const cookies = document.cookie
      .split("; ")
      .reduce((acc: Cookies, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});

    const clientId = extractValueFromCookie(cookies, "_ga");
    const fbBrowserId = extractValueFromCookie(cookies, "_fbp");
    const fbClickId = extractValueFromCookie(cookies, "_fbc");
    const vwoUuid = extractValueFromCookie(cookies, "_vwo_uuid_v2");
    const gaExperiment = extractValueFromCookie(cookies, "_gaexp");
    const clarity_id = extractValueFromCookie(cookies, "_clsk");

    const addExtraParams = (baseParams: Record<string, string>) => {
      const extraParams = {
        funnel: info.slug,
        product: product.product.toString(),
        productName: product.productName,
        productPrice: product.productPrice,
        productShipping: product.productShipping,
        productShippingId: product.productShippingId,
        productOfferId: product.productOfferId,
        paymentType: "credit",
        total: `${info.product.price2}`,
        productId: `${info.product.stickyId2}`,
        campaignId: `${info.stickyCampaign}`,
        source_url: `${baseUrl}/checkout`,
        client_id: clientId,
        fb_browser_id: fbBrowserId,
        fb_click_id: fbClickId,
        ff_vid: ffVid || "missing-ff-vid",
        ff_hitid: hitId || "missing-ff-hitid",
        vwo_uuid: vwoUuid,
        ga_experiment: gaExperiment,
        clarity_id: clarity_id,
        mixpanel_id: mixpanel_id || "missing-mixpanel-id",
        urlParams: JSON.stringify(baseParams),
        currentStep: "0",
        clickId: clickId || "",
        notes: `${window.location.href} | ${navigator.userAgent}`,
        userAgent: navigator.userAgent,
      };
      return extraParams;
    };

    const startParams = addExtraParams(params);

    if (!sessionId && clickId) {
      // console.log("Starting session with params: ", startParams);
      startSession(startParams);
    } else if (sessionId) {
      // console.log("Fetching session data for session: ", sessionId);
      fetchSessionData(sessionId);
    } else {
      // console.log("No sessionId or clickId found");
    }
  }, [sessionId, searchParams, info, clickId]);

  return <></>;
};

const HandleSessionStart = (props: HandleSessionStartProps) => {
  return (
    <Suspense>
      <HandleSessionStartContent {...props} />
    </Suspense>
  );
};

export default HandleSessionStart;
