import { Analytics } from "@segment/analytics-node";
import { SessionDataType } from "@/interfaces/sessionData";
import { ShopifyOrderType } from "@/interfaces/shopifyOrderData";
import { siteProduct } from "@/lib/site-info";

type Props = {
  orderData: ShopifyOrderType;
  sessionData: SessionDataType;
};

const sendToSegment = async ({ orderData, sessionData }: Props) => {
  const segmentApiKey = process.env.SEGMENT_API_KEY;
  const analytics = new Analytics({ writeKey: segmentApiKey!, flushAt: 1 });

  const calculateTotalShippingCost = (order: ShopifyOrderType) => {
    return order.shipping_lines.reduce((total, line) => {
      return total + parseFloat(line.price);
    }, 0);
  };

  const properties = {
    affiliation: sessionData.customFields?.cf41,
    tax: orderData.total_tax,
    shipping: calculateTotalShippingCost(orderData),
    orderID:
      sessionData.orderData?.order_id ||
      sessionData.paypalOrder?.orderId ||
      "missing order id?",
    order_total: orderData.total_price,
    eventType: "conversion",
    click_id: sessionData.clickId,
    mixpanel_id: sessionData.mixpanel_id,
    conversionRevenue: orderData.total_price,
    country: orderData.billing_address.country,
    eventTime: new Date().toISOString(),
    ff_vid: sessionData.ff_vid,
    hitID: sessionData.ff_hitid,
    hitTime: new Date().toISOString(),
    gclid: sessionData.customFields?.cf6,
    currency: orderData.currency,
    paymentType: sessionData.paymentType,
    campaignOrderFrom: sessionData.customFields?.cf24,
    affid: sessionData.customFields?.cf42,
    customer_id: sessionData.orderData?.customerId,
    billing_city: orderData.billing_address.city,
    billing_country: orderData.billing_address.country,
    billing_state_id: orderData.billing_address.province,
    billing_zip: orderData.billing_address.zip,
    afid: sessionData.customFields?.cf41,
    fb_browser_id: sessionData.fb_browser_id,
    fb_click_id: sessionData.fb_click_id,
    client_user_agent: sessionData.customFields?.cf44,
    first_name: orderData.customer.first_name,
    last_name: orderData.customer.last_name,
    vwo_uuid: sessionData.vwo_uuid,
    sub1: sessionData.customFields?.cf27,
    sub2: sessionData.customFields?.cf28,
    sub3: sessionData.customFields?.cf29,
    sub4: sessionData.customFields?.cf7,
    sub5: sessionData.customFields?.cf34,
    wbraid: sessionData.customFields?.cf36,
    gbraid: sessionData.customFields?.cf37,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent,
  };

  // console.log("Sending Segment Analytics properties:", properties);

  await new Promise((resolve) =>
    analytics.track(
      {
        userId: sessionData.client_id!,
        event: `${siteProduct} Purchase  - VERCEL`,
        properties: properties,
      },
      resolve
    )
  );
  console.log("Data sent to Segment! - ", properties);
};

export default sendToSegment;
