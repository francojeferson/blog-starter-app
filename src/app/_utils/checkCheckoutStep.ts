import React from "react";
import { useRouter } from "next/navigation";
import { siteProduct } from "@/lib/site-info";
import { useSession } from "../_context/SessionContext";
import { sendGAEvent } from "@next/third-parties/google";
import { createJimmyKey } from "./jimmyKeyUtils";
import { SessionDataType } from "@/interfaces/sessionData";

type CheckStepProps = {
  sessionId: string;
  pageStep: number;
};

// type SessionData = {
//   currentStep: number;
//   orderData?: {
//     order_id: string;
//   };
//   orderConfirmedAt?: string;
//   orderFinalized?: boolean;
// };

// Enum for session steps
enum SessionStep {
  Checkout = 0,
  Upsell1 = 1,
  Upsell2 = 2,
  Upsell3 = 3,
  Upsell4 = 4,
  Upsell5 = 5,
  Upsell6 = 6,
  ThankYou = 7,
}

const removeSession = () => {
  localStorage.removeItem("session");
};

const useCheckStep = () => {
  const router = useRouter();
  const { sessionId, setSessionId } = useSession();

  // Use React's useRef to persist the timer across re-renders
  const finalizationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const checkStep = async ({ sessionId, pageStep }: CheckStepProps) => {
    if (!sessionId) {
      console.error("No sessionId provided");
      return;
    }
    try {
      const response = await fetch("/api/session/fetch-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { session: sessionData } = (await response.json()) as {
        session: SessionDataType;
      };

      if (sessionData) {
        handleStepNavigation(sessionId, sessionData, pageStep);
        return sessionData;
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      // alert("There was an error processing your request. Please try again.");
    }
  };

  const handleStepNavigation = (
    sessionId: string,
    sessionData: SessionDataType,
    pageStep: number
  ) => {
    const { currentStep, orderData, orderConfirmedAt, orderFinalized } =
      sessionData;
    const sessionStep = parseInt(currentStep, 10) as SessionStep;

    // Clear the timer if we're on the thank you page
    if (sessionStep === SessionStep.ThankYou) {
      if (finalizationTimerRef.current) {
        clearTimeout(finalizationTimerRef.current);
        finalizationTimerRef.current = null;
      }
      handleCompletedPurchase(pageStep, orderData);
      return;
    }

    if (parseInt(currentStep, 10) > 0 && orderConfirmedAt && !orderFinalized) {
      const orderTime = new Date(orderConfirmedAt).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - orderTime;
      if (timeDiff > 10 * 60 * 1000) {
        finalizePurchase(sessionId);
      } else {
        // Clear any existing timer
        if (finalizationTimerRef.current) {
          clearTimeout(finalizationTimerRef.current);
        }
        // Set a new timer
        finalizationTimerRef.current = setTimeout(() => {
          finalizePurchase(sessionId);
        }, 10 * 60 * 1000 - timeDiff);
      }
    }

    switch (sessionStep) {
      case SessionStep.Checkout:
        if (pageStep > SessionStep.Checkout) {
          router.push(`/checkout`);
        }
        break;
      default:
        handleUpsellNavigation(sessionStep, pageStep, orderData);
        break;
    }
  };

  const handleCompletedPurchase = (
    pageStep: number,
    orderData?: SessionDataType["orderData"]
  ) => {
    if (pageStep === SessionStep.Checkout && orderData?.order_id) {
      presentOrderCompletionOptions(orderData.order_id);
    } else if (pageStep === SessionStep.Upsell6) {
      alert("Do Not Use the Back Button - Your Order May Be Duplicated");
      router.push(`/checkout/thank-you`);
    }
  };

  const handleUpsellNavigation = (
    sessionStep: SessionStep,
    pageStep: number,
    orderData?: SessionDataType["orderData"]
  ) => {
    if (sessionStep > pageStep) {
      if (sessionStep === SessionStep.ThankYou) {
        // Handle the case when user is on thank-you page and hits back
        alert("Do Not Use the Back Button - Your Order May Be Duplicated");
        router.push(`/checkout/thank-you`);
      } else if (
        sessionStep === SessionStep.Upsell6 &&
        pageStep < SessionStep.Upsell6
      ) {
        // Handle the case when user is on last upsell and hits back
        alert("Do Not Use the Back Button - Your Order May Be Duplicated");
        router.push(`/checkout/upsell6`);
      } else if (
        sessionStep >= SessionStep.Upsell1 &&
        sessionStep <= SessionStep.Upsell6
      ) {
        // Handle navigation for valid upsell pages
        alert("Do Not Use the Back Button - Your Order May Be Duplicated");
        router.push(`/checkout/upsell${sessionStep}`);
      } else if (!orderData?.order_id) {
        alert(
          "Warning: You are currently in an active order. Do not use the back, forward, or refresh buttons."
        );
        router.push(
          `/checkout/upsell${Math.min(sessionStep, SessionStep.Upsell6)}`
        );
      } else {
        presentOrderCompletionOptions(orderData.order_id);
      }
    }
  };

  const presentOrderCompletionOptions = (orderId: string) => {
    const viewOrderDetails = window.confirm(
      `Your order ${orderId} has been processed. Would you like to view order details? Click OK to view details or Cancel to explore more options.`
    );

    if (viewOrderDetails) {
      router.push(`/checkout/thank-you`);
    } else {
      const startNewOrder = window.confirm(
        `Want more ${siteProduct}? Click OK to start a new order or Cancel to return to the homepage.`
      );
      if (startNewOrder) {
        //clear the session data
        removeSession();
        setSessionId("");
        router.push(`/checkout`);
        window.location.reload();
      } else {
        router.push(`/`); // Redirect to homepage if user doesn't want to start a new order
      }
    }
  };

  const finalizePurchase = async (sessionId: string) => {
    sendGAEvent("event", "purchase-finalized", {
      sessionId: sessionId,
      finalizedBy: "active-session-timeout",
    });
    // console.log(
    //   "Session Time Expired - Finalizing Purchase for Session:",
    //   sessionId
    // );
    try {
      const response = await fetch("/api/session/finalize-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({
          sessionId,
          finalizedBy: "active-session-timeout",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        router.push(`/checkout/thank-you`);
      }
    } catch (error) {
      console.error("Error finalizing purchase:", error);
      return null;
    }
  };

  // Clean up the timer when the component unmounts
  React.useEffect(() => {
    return () => {
      if (finalizationTimerRef.current) {
        clearTimeout(finalizationTimerRef.current);
      }
    };
  }, []);

  return checkStep;
};

export default useCheckStep;
