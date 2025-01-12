import { adminDb } from "../../../../firebaseAdmin";
import sendSlackMessage from "./sendSlackApiHelper";
import { SessionDataType } from "@/interfaces/sessionData";
import { kv } from "@vercel/kv";

const handleFailedOrder = async (
  sessionId: string,
  sessionData: SessionDataType,
  paymentType: string,
  finalizedBy: string
) => {
  console.log("Handling Failed Order for session: ", sessionId);
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];

  let attempts = sessionData.finalizationAttempts || 0;
  attempts++;

  const userFinalized = finalizedBy.startsWith("upsell");

  await sendSlackMessage(
    "🚨 - Order Failed to Finalize",
    `Failed Attempt #${attempts} - Finalized by: ${finalizedBy}`,
    sessionId,
    ""
  );

  const maxAttempts = userFinalized ? 3 : 1;

  if (attempts >= maxAttempts) {
    const finalSessionData = {
      ...sessionData,
      currentStep: "7",
      orderFinalized: true,
      finalizedBy: userFinalized ? "too-many-failed-attempts" : finalizedBy,
      finalizedAt: new Date().toISOString(),
    };

    const collectionName =
      paymentType === "paypal" ? "paypalOrders-error" : "creditOrders-error";
    const activeSessionsKey =
      paymentType === "paypal" ? "paypal-active-sessions" : "active-sessions";

    await kv.srem(activeSessionsKey, sessionId);

    try {
      await adminDb
        .collection(collectionName)
        .doc(dateString)
        .collection("sessions")
        .doc(sessionId)
        .set({ finalSessionData });
    } catch (error) {
      console.error(
        `Error setting ${paymentType} ERROR order in firestore - session: `,
        sessionId
      );
    }

    console.error("Finalization attempts exceeded for session: ", sessionId);

    await kv.set(`session:${sessionId}`, finalSessionData);

    return { message: "Finalization attempts exceeded", attempts: maxAttempts };
  }

  const updatedSessionData = {
    ...sessionData,
    finalizationAttempts: attempts,
  };

  await kv.set(`session:${sessionId}`, updatedSessionData);
  await kv.del(`session:${sessionId}:processing`);

  return {
    message: "failed",
    attempts: userFinalized ? attempts : undefined,
  };
};

export default handleFailedOrder;
