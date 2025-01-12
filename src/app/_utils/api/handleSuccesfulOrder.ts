import { kv } from "@vercel/kv";
import { createShopifyOrder } from "@/app/_utils/shopifyConnector";
import { SessionDataType } from "@/interfaces/sessionData";
import { adminDb } from "../../../../firebaseAdmin";
import sendSlackMessage from "@/app/_utils/api/sendSlackApiHelper";
import { trackOrder } from "./mixpanelTracking";

type Props = {
  sessionId: string;
  sessionData: SessionDataType;
};

// const googleAfids = [
//   "YT",
//   "GD",
//   "GSHOP",
//   "GSEARCH",
//   "Discovery",
//   "CTC",
//   "CTCJ",
// ];

// const isGoogle = (afid: string) => googleAfids.includes(afid);

export async function handleSuccessfulOrder({
  sessionId,
  sessionData,
}: Props): Promise<void> {
  console.log("Handle Successful Order - Session: ", sessionId);

  try {
    // Push the session to Shopify
    let shopifyOrderData;
    try {
      shopifyOrderData = await createShopifyOrder(sessionData);
    } catch (error) {
      shopifyOrderData = error;
      console.error(
        "Error creating Shopify order for session: ",
        sessionId,
        error
      );
    }

    // Add Mixpanel tracking here
    try {
      await trackOrder({
        sessionData: {
          ...sessionData,
          shopifyData: shopifyOrderData,
        },
      });
      console.log(
        "Successfully tracked order in Mixpanel for session:",
        sessionId
      );
    } catch (error) {
      console.error("Error tracking order in Mixpanel:", sessionId, error);
    }

    // Prepare the final session data
    const finalSessionData: SessionDataType = {
      ...sessionData,
      shopifyData: shopifyOrderData,
    };

    // let afid = sessionData?.customFields?.cf41 || "";
    // postback to correct traffic source
    // if (isGoogle(afid)) {
    //   handleGooglePostback({ sessionId, sessionData });
    // }

    // Save the session data to Firestore
    const paymentType =
      sessionData.paymentType === "paypal"
        ? "paypalOrders"
        : "creditCardOrders";
    const dateString = new Date().toISOString().split("T")[0];

    try {
      await adminDb
        .collection(paymentType)
        .doc(dateString)
        .collection("sessions")
        .doc(sessionId)
        .set({ finalSessionData });
    } catch (e) {
      await sendSlackMessage(
        "🚨 - Error Setting Order in Firestore",
        `Order Confirmed but didn't get to Shopify - finalized by ${sessionData?.finalizedBy}`,
        sessionId,
        ""
      );
      console.error(
        "Error setting order in Firestore - session: ",
        sessionId,
        e
      );
    }

    // Remove the session from KV
    await kv.srem("successful-orders", sessionId);
    console.log("Processed order for session: ", sessionId);
  } catch (error) {
    console.error(`Error processing session ${sessionId}:`, error);
  }
}
