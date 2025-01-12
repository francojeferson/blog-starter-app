import { GoogleAdsApi, Customer, services } from "google-ads-api";
import { SessionDataType } from "@/interfaces/sessionData";

type Props = {
  sessionId: string;
  sessionData: SessionDataType;
};

interface CustomFields {
  cf6?: string; // gclid
  cf36?: string; // wbraid
  cf37?: string; // gbraid
}

interface ConversionData {
  conversion_action: string;
  conversion_date_time: string;
  conversion_value: number;
  currency_code: string;
  order_id?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
}

function formatDate(date: Date): string {
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offset / 60));
  const offsetMinutes = Math.abs(offset % 60);
  const offsetSign = offset >= 0 ? "+" : "-";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${offsetSign}${pad(
    offsetHours
  )}:${pad(offsetMinutes)}`;
}

const handleGooglePostback = async ({
  sessionId,
  sessionData,
}: Props): Promise<any> => {
  console.log("Posting back to Google Ads for session: ", sessionId);
  try {
    let total = 0;
    let orderId: string | undefined;

    if (sessionData.paymentType === "paypal") {
      total =
        parseFloat(sessionData.paypalOrder?.orderTotal || "0") +
        parseFloat(sessionData.upsellOrderData?.orderTotal || "0");
      orderId = sessionData.paypalOrder?.orderId;
    } else if (sessionData.paymentType === "credit") {
      total = parseFloat(sessionData.orderData?.orderTotal || "0");
      orderId = sessionData.orderData?.order_id;
    }

    const client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const customer: Customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    const customFields: CustomFields = sessionData.customFields || {};

    let clickIdentifier: { gclid?: string; gbraid?: string; wbraid?: string } =
      {};
    if (customFields.cf6) {
      clickIdentifier = { gclid: customFields.cf6 };
    } else if (customFields.cf37) {
      clickIdentifier = { gbraid: customFields.cf37 };
    } else if (customFields.cf36) {
      clickIdentifier = { wbraid: customFields.cf36 };
    }

    const conversionData: ConversionData = {
      conversion_action: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/conversionActions/${process.env.GOOGLE_ADS_CUSTOMER_ID2}`,
      conversion_date_time: formatDate(new Date()),
      conversion_value: total,
      currency_code: "USD",
      order_id: orderId,
      ...clickIdentifier,
    };

    const request = new services.UploadClickConversionsRequest({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      conversions: [conversionData],
      partial_failure: true,
    });
    console.log("Uploading conversion to Google Ads:", request);

    const data = await customer.conversionUploads.uploadClickConversions(
      request
    );

    console.log("Conversion uploaded to Google Ads:", data);

    return data;
  } catch (error) {
    console.error("Error uploading conversion to Google Ads:", error);
    throw error;
  }
};

export default handleGooglePostback;
