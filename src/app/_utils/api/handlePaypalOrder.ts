import { SessionDataType } from "@/interfaces/sessionData";
import handleFailedOrder from "./handleFailedOrder";
import sendSlackMessage from "./sendSlackApiHelper";
import { kv } from "@vercel/kv";
import { handleSuccessfulOrder } from "./handleSuccesfulOrder";

const API_KEY = process.env.API_KEY;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

//handle paypal order
const handlePaypalOrder = async (
  upsellOrderInfo: any,
  sessionData: SessionDataType,
  sessionId: string,
  finalizedBy: string
) => {
  console.log("Handling Paypal Order for session: ", sessionId);
  const sessionKey = `session:${sessionId}`;

  // get the current date in YYYY-MM-DD format
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];

  // if there are no upsells, finalize the session
  if (upsellOrderInfo.offers.length === 0) {
    console.log("No upsell offers found, finalizing session: ", sessionId);
    const finalSessionData = {
      ...sessionData,
      currentStep: "7",
      orderFinalized: true,
      finalizedBy: finalizedBy,
      finalizedAt: new Date().toISOString(),
    };

    await handleSuccessfulOrder({ sessionId, sessionData: finalSessionData });
    await kv.srem("paypal-active-sessions", sessionId);
    // send success slack message
    const orderTotal = parseFloat(
      finalSessionData?.paypalOrder?.orderTotal || "0"
    );

    await kv.set(sessionKey, finalSessionData);

    await sendSlackMessage(
      "💰💰💰 - New Paypal Order Recieved",
      `Order ${
        finalSessionData?.paypalOrder?.orderId
      } finalized by ${finalizedBy} for ${
        sessionData.customerInfo.firstName
      } ${sessionData.customerInfo.lastName.slice(
        0,
        2
      )}. - $${orderTotal.toFixed(2)}`,
      sessionId,
      `https://admin.fourammedia.com/sessions/paypalOrders/${dateString}/${sessionId}`
    );

    return { message: "success", attempts: 69 };
  }

  console.log(
    "Finalize-Purchase - Upsell Paypal Order Requested for session: ",
    sessionId
  );

  //call upsell-order route
  const orderResponse = await fetch(
    `${NEXT_PUBLIC_API_URL}/api/order/upsell-order`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
      }),
      body: JSON.stringify(upsellOrderInfo),
    }
  );
  // log the response
  const orderResult = await orderResponse.json();
  console.log(
    "Finalize-Purchase - Complete Paypal Upsell Order response: ",
    orderResult
  );

  // validate the order result - if no order_id handle failed order and return error
  if (!orderResult.orderResult?.order_id) {
    const errorMessage = handleFailedOrder(
      sessionId,
      sessionData,
      dateString,
      finalizedBy
    );
    return errorMessage;
  }

  // with success, update session data with order result and finalize
  const finalSessionData: SessionDataType = {
    ...sessionData,
    currentStep: "7",
    orderSuccess: orderResult.orderResult?.response_code || "",
    orderFinalized: true,
    upsellOrderData: orderResult.orderResult || "",
    finalizedAt: new Date().toISOString(),
    finalizedBy: finalizedBy,
  };

  await handleSuccessfulOrder({ sessionId, sessionData: finalSessionData });
  await kv.srem("paypal-active-sessions", sessionId);
  const updatedActiveSessions = await kv.smembers("paypal-active-sessions");
  console.log("Updated Paypal Active Sessions: ", updatedActiveSessions);

  //update session data in vercel kv
  await kv.set(sessionKey, finalSessionData);

  // send success slack message
  const firstTotal = parseFloat(
    finalSessionData?.paypalOrder?.orderTotal || "0"
  );
  const secondTotal = parseFloat(
    finalSessionData?.upsellOrderData?.orderTotal || "0"
  );
  const orderTotal = firstTotal + secondTotal;

  await sendSlackMessage(
    "💰💰💰 - New Paypal Order Recieved",
    `Order ${
      orderResult.orderResult?.order_id
    } finalized by ${finalizedBy} for ${
      sessionData.customerInfo.firstName
    } ${sessionData.customerInfo.lastName.slice(0, 2)}. - $${orderTotal.toFixed(
      2
    )}`,
    sessionId,
    `https://admin.fourammedia.com/sessions/paypalOrders/${dateString}/${sessionId}`
  );

  return { message: "success", attempts: 69 };
};

export default handlePaypalOrder;
