import { baseUrl } from "@/lib/site-info";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { createJimmyKey } from "@/app/_utils/jimmyKeyUtils";
import { ProductInfoType } from "@/interfaces/productInfo";
import sendSlackMessage from "./api/sendSlackApiHelper";

type Cookies = { [key: string]: string };

const extractValueFromCookie = (cookies: Cookies, cookieName: string) => {
  const cookieValue = cookies[cookieName] || "";
  if (cookieValue) {
    if (cookieName.startsWith("_vwo_uuid")) {
      return cookieValue;
    }
    if (cookieName === "_clsk") {
      return getClarityUserId(cookieValue);
    }
    const matches = cookieValue.match(/^.+\.(.+?\..+?)$/);
    return matches ? matches[1] : "";
  }
  return "";
};

const getClarityUserId = (cookieValue: string) => {
  const decodedValue = decodeURIComponent(cookieValue);
  return decodedValue.split("|")[0];
};

export const emergencyStartSession = async (
  info: CheckoutPageType,
  product: ProductInfoType,
  setSessionId: (id: string) => void,
  ff_vid: string,
  ff_hitid: string
): Promise<string | null> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const cookies = document.cookie.split("; ").reduce((acc: Cookies, cookie) => {
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

  let total =
    parseFloat(product.productPrice) + parseFloat(product.productShipping) + 0;

  const emergencyParams = {
    funnel: info.slug,
    product: product.product.toString(),
    productName: product.productName,
    productPrice: product.productPrice,
    productShipping: product.productShipping,
    productShippingId: product.productShippingId,
    productOfferId: product.productOfferId,
    paymentType: "credit",
    total: `${total.toFixed(2)}`,
    productId: `${product.productStickyId}`,
    campaignId: `${info.stickyCampaign}`,
    source_url: `${baseUrl}/checkout`,
    client_id: clientId || "missing-client-id",
    fb_browser_id: fbBrowserId || "missing-fb-browser-id",
    fb_click_id: fbClickId || "missing-fb-click-id",
    ff_vid: ff_vid || "missing-ff-vid",
    ff_hitid: ff_hitid || "missing-ff-hitid",
    vwo_uuid: vwoUuid || "missing-vwo-uuid",
    ga_experiment: gaExperiment || "missing-ga-experiment",
    clarity_id: clarity_id || "missing-clarity-id",
    mixpanel_id: "missing-mixpanel-id",
    urlParams: JSON.stringify(params),
    currentStep: "0",
    clickId: "missing-click-id",
    notes: `${window.location.href} | ${navigator.userAgent} | EMERGENCY SESSION START`,
    userAgent: navigator.userAgent,
  };

  try {
    // console.log("Emergency: Starting session with params: ", emergencyParams);
    sendSlackMessage(
      "Emergency Session Start",
      JSON.stringify(emergencyParams),
      "No Session ID - Generating Emergency Session ID",
      ""
    );
    const response = await fetch("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jimmy-key": createJimmyKey().encryptedData,
      },
      body: JSON.stringify(emergencyParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sessionStart = await response.json();
    // console.log("Emergency Session Start Response: ", sessionStart);
    const newSessionId = sessionStart.sessionId;
    setSessionId(newSessionId);
    return newSessionId;
  } catch (error) {
    console.error("Error starting emergency session:", error);
    await sendSlackMessage(
      "Error - Failed to Start Emergency Session - Checkout Page",
      JSON.stringify(error),
      emergencyParams as unknown as string,
      ""
    );
    return null;
  }
};
