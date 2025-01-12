import { SessionDataType } from "@/interfaces/sessionData";
import { CustomerInfoType } from "@/interfaces/customerInfo";
import handleFailedOrder from "./handleFailedOrder";
import sendSlackMessage from "./sendSlackApiHelper";
import { kv } from "@vercel/kv";
import { handleSuccessfulOrder } from "./handleSuccesfulOrder";

const API_KEY = process.env.API_KEY;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

type CardInfoType = {
  card: string;
  cvv: string;
  month: string;
  year: string;
};

//handle credit card order
const handleNewCard = async (
  sessionData: SessionDataType,
  sessionId: string,
  finalizedBy: string,
  ip: string,
  card: CardInfoType
) => {
  console.log("Handling New Card Order for session: ", sessionId);
  const sessionKey = `session:${sessionId}`;
  // get the current date in YYYY-MM-DD format
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];

  // grab customer info from session data
  const customerInfo: CustomerInfoType = sessionData?.customerInfo!;

  if (!customerInfo) {
    return { message: "No customer info found", attempts: 3 };
  }

  const formattedMonth = card.month.padStart(2, "0"); // Ensures month is 2 digits
  const formattedYear = card.year.slice(-2); // Gets last 2 digits of year

  // build final order info with new card
  const orderInfo = {
    sessionId: sessionId,
    billingFirstName: customerInfo.firstName,
    billingLastName: customerInfo.lastName,
    currency: "USD",
    billingAddress1: customerInfo.address,
    billingAddress2: customerInfo.address2 || "",
    billingCity: customerInfo.city,
    billingState: customerInfo.state,
    billingZip: customerInfo.zip,
    billingCountry: customerInfo.country,
    phone: customerInfo.phone,
    email: customerInfo.email,
    shippingId: sessionData.productShippingId,
    ipAddress: ip, // Assuming you get the IP address from headers
    productId: sessionData.productId,
    offerId: sessionData.productOfferId,
    campaignId: sessionData.campaignId,
    billingId: sessionData.billingId || "2",
    auth_amount: sessionData.total || 1.0,
    offers: sessionData.upsells,
    promoCode: customerInfo.couponActive ? "5OFFPOP" : "",
    customFields: sessionData.customFields,
    clickId: sessionData.clickId || "",
    notes: customerInfo.notes || "missing-notes-finalize-purchase", // Assuming you have custom fields stored in session data
    ff_vid: sessionData.ff_vid || "missing-ff-vid",
    creditCardNumber: card.card,
    CVV: card.cvv,
    expirationDate: `${formattedMonth}${formattedYear}`,
  };

  // Call the complete order route
  console.log(
    "Finalize-Purchase - New Card Order Requested for session: ",
    sessionId
  );

  const orderResponse = await fetch(
    `${NEXT_PUBLIC_API_URL}/api/order/complete-new-card`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
      }),
      body: JSON.stringify(orderInfo),
    }
  );

  // log the response
  const orderResult = await orderResponse.json();
  console.log(
    "Finalize-Purchase - Complete New Card Order response: ",
    orderResult
  );

  // if the order failed, handle it
  if (!orderResult.orderResult?.order_id) {
    const errorMessage = handleFailedOrder(
      sessionId,
      sessionData,
      "credit",
      finalizedBy
    );
    return errorMessage;
  }

  // let shopifyOrderData;
  // Update session based on order result
  const finalSessionData: SessionDataType = {
    ...sessionData,
    currentStep: "7",
    orderSuccess: orderResult.orderResult?.response_code || "",
    orderFinalized: true,
    orderData: orderResult.orderResult || "",
    finalizedAt: new Date().toISOString(),
    finalizedBy: finalizedBy,
  };
  // // Create Shopify order
  // try {
  //   shopifyOrderData = await createShopifyOrder(shopifySessionData);
  // } catch (error) {
  //   console.error("Error creating Shopify order for session: ", sessionId);
  //   // Decide how you want to handle Shopify order creation failures
  //   // You might want to log this error but still consider the order as finalized
  // }

  // const finalSessionData = {
  //   ...shopifySessionData,
  //   shopifyOrderData,
  // };

  // if (orderResult?.orderResult?.response_code === "100") {
  //   try {
  //     await adminDb
  //       .collection("creditCardOrders")
  //       .doc(dateString)
  //       .collection("sessions")
  //       .doc(sessionId)
  //       .set({
  //         finalSessionData,
  //       });
  //   } catch (e) {
  //     console.log(
  //       "Error setting credit card order in firestore - session: ",
  //       sessionId
  //     );
  //   }
  // } else {
  //   try {
  //     await adminDb
  //       .collection("creditCardOrders-error")
  //       .doc(dateString)
  //       .collection("sessions")
  //       .doc(sessionId)
  //       .set({
  //         finalSessionData,
  //       });
  //   } catch (e) {
  //     console.log(
  //       "Error setting credit card order in firestore - session: ",
  //       sessionId
  //     );
  //   }
  // }

  await kv.srem("active-sessions", sessionId);
  console.log("Processing Succeessfurl order for: ", sessionId);
  await handleSuccessfulOrder({ sessionId, sessionData: finalSessionData });

  await kv.set(sessionKey, finalSessionData);

  await sendSlackMessage(
    "💰💰💰 - New Order Recieved",
    `Order ${orderResult.orderResult?.order_id} finalized by ${finalizedBy} - $${orderResult.orderResult?.orderTotal}`,
    sessionId,
    `https://admin.fourammedia.com/sessions/creditCardOrders/${dateString}/${sessionId}`
  );

  return { message: "success", attempts: 69 };
};

export default handleNewCard;
