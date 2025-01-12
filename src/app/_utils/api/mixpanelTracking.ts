// app/_utils/tracking/mixpanelTracking.ts
import Mixpanel from "mixpanel";
import { SessionDataType } from "@/interfaces/sessionData";
import { UpsellInfoType } from "@/interfaces/upsellInfo";
import { funnelName } from "@/lib/site-info";

// Initialize Mixpanel with your project token
const mixpanel = Mixpanel.init("5e474d63d8b59659f6591eadf8f3ad85");

export interface OrderTrackingData {
  sessionData: SessionDataType;
}

// Helper function to generate product CSV strings
const generateProductCSVStrings = (sessionData: SessionDataType) => {
  // Start with main product
  const names: string[] = [sessionData.productName || ""];
  const prices: string[] = [sessionData.productPrice || "0"];
  const quantities: string[] = ["1"]; // Assuming quantity of 1 for main product
  const skus: string[] = [sessionData.productId || ""]; // Using productId as SKU

  // Add upsell products if they exist
  if (sessionData.upsells?.length) {
    sessionData.upsells.forEach((upsell: UpsellInfoType) => {
      names.push(upsell.offerName || "");
      prices.push(String(upsell.offerPrice) || "0");
      quantities.push("1"); // Assuming quantity of 1 for upsells
      skus.push(upsell.offerId || ""); // Using offerId as SKU
    });
  }

  return {
    product_names_csv: names.join(","),
    product_prices_csv: prices.join(","),
    product_qtys_csv: quantities.join(","),
    product_skus_csv: skus.join(","),
  };
};

export const trackOrder = async ({
  sessionData,
}: OrderTrackingData): Promise<void> => {
  // Calculate total revenue including upsells
  const mainOrderTotal = parseFloat(
    sessionData?.orderData?.orderTotal ||
      sessionData?.paypalOrder?.orderTotal ||
      "0"
  );
  const upsellTotal = parseFloat(
    sessionData?.upsellOrderData?.orderTotal || "0"
  );
  const totalRevenue = mainOrderTotal + upsellTotal;

  const mainOrderTax = parseFloat(
    sessionData?.orderData?.orderSalesTaxAmount ||
      sessionData?.paypalOrder?.orderSalesTaxAmount ||
      "0"
  );
  const upsellTax = parseFloat(
    sessionData?.upsellOrderData?.orderSalesTaxAmount || "0"
  );
  const totalTax = mainOrderTax + upsellTax;

  const saleTaxPercent = totalTax / totalRevenue;

  // Format products data
  const mainProduct = {
    product_id: sessionData.productId,
    name: sessionData.productName,
    price: parseFloat(sessionData.productPrice || "0"),
    shipping: parseFloat(sessionData.productShipping || "0"),
  };

  // Format upsells using correct structure
  const upsellProducts =
    sessionData.upsells?.map((upsell: UpsellInfoType) => ({
      offer_id: upsell.offerId,
      offer_name: upsell.offerName,
      price: upsell.offerPrice,
      billing_type: upsell.offerBilling,
      offer_offer_id: upsell.offerOfferId,
    })) || [];

  //generate product CSV strings
  const productCSVs = generateProductCSVStrings(sessionData);

  // Extract important custom fields
  const afid = sessionData.customFields?.cf41 || "direct";
  const campaignName = sessionData.customFields?.cf24 || "unknown";

  const eventName = "sale-vercel";

  return new Promise((resolve, reject) => {
    mixpanel.track(
      eventName,
      {
        // Order Identifiers
        distinct_id: sessionData.mixpanel_id,
        ad_name: sessionData.customFields?.cf25,
        adaccount: sessionData.customFields?.cf35,
        adset_name: sessionData.customFields?.cf26,
        affid: sessionData.customFields?.cf42 || "39 - Internal",
        ancestor_id:
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        authorization_id:
          sessionData.orderData?.authId || sessionData.paypalOrder?.customerId,
        bar: "sidecar",
        billing_address: sessionData.customerInfo.address,
        billing_address_2: sessionData.customerInfo.address2,
        billing_city: sessionData.customerInfo.city,
        billing_country: sessionData.customerInfo.country,
        billing_state_id: sessionData.customerInfo.state,
        billing_zip: sessionData.customerInfo.zip,
        browser: sessionData.customFields?.cf2,
        c1: sessionData.customFields?.ff_vid,
        c2: sessionData.customFields?.cf6,
        c3: "see me",
        campaign_desc: "adrian is a pain in my ass",
        cb_service_outcome: "",
        cb_service_source: "",
        cb_service_type: "",
        chk: sessionData.customFields?.cf16,
        chkbtn: "",
        chkord: "",
        cid: "",
        clarity_user_id: sessionData.customFields?.cf19,
        click_id: sessionData.clickId,
        client_id: sessionData.client_id,
        client_user_agent: sessionData.userAgent,
        "Customer ID": sessionData.stickyCustomerId,
        decline_reason: "",
        device: sessionData.userAgent,
        Email: sessionData.customerInfo.email,
        experiment_id: sessionData.customFields?.cf17,
        expi_id2: "",
        fb_browser_id: sessionData.fb_browser_id,
        fb_click_id: sessionData.fb_click_id,
        first_name: sessionData.customerInfo.firstName,
        fnl: sessionData.funnel,
        from: "vercel",
        ftr: "",
        funnel: funnelName,
        funnelflux_hit_id: sessionData.customFields?.cf11,

        gbraid: sessionData.customFields?.cf37,
        initial_referrer: sessionData.customFields?.cf41,
        is_fraud: "0",
        is_recurring: "0",
        is_test_cc: "0",
        ischargeback: "0",
        last_name: sessionData.customerInfo.lastName,
        oid: sessionData.customFields?.cf10,
        "Order ID":
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        order_date: sessionData.orderConfirmedAt,
        order_status: "1",
        order_total: totalRevenue,
        parent_order: "1",
        payment_method: sessionData.paymentType,
        Phone: sessionData.customerInfo.phone,
        post_back_action: "finalized",
        prk: sessionData.customFields?.cf13,
        prkvar: sessionData.customFields?.cf22,
        product_id_csv: productCSVs.product_skus_csv,
        product_names_csv: productCSVs.product_names_csv,
        product_prices_csv: productCSVs.product_prices_csv,
        product_qtys_csv: productCSVs.product_qtys_csv,
        product_skus_csv: productCSVs.product_skus_csv,
        qclid: sessionData.customFields?.cf32,
        rebill_depth: "0",
        recurring_date: "0000-00-00",
        sales_tax_percent: saleTaxPercent,
        shipping_total: sessionData.productShipping,
        sid: "",
        source_id: sessionData.customFields?.cf1,
        sub1: sessionData.customFields?.cf27,
        sub2: sessionData.customFields?.cf28,
        sub3: sessionData.customFields?.cf29,
        sub4: sessionData.customFields?.cf7,
        sub5: sessionData.customFields?.cf34,
        sub_affiliate: "",
        subscription_active_csv: "",
        taxable_amount: totalRevenue - totalTax,
        transaction_id:
          sessionData.orderData?.transactionID ||
          sessionData.paypalOrder?.orderId,
        ups: sessionData.customFields?.cf20,
        utm_device_category: sessionData.customFields?.cf39,
        void_refund_amount: "0.00",
        vwo_uuid: sessionData.customFields?.cf31,
        wbraid: sessionData.customFields?.cf36,

        //don't worry about after here

        order_id:
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        session_id: sessionData.billingId,

        // Customer Information
        customer_email: sessionData.customerInfo.email,
        customer_phone: sessionData.customerInfo.phone,
        customer_name: `${sessionData.customerInfo.firstName} ${sessionData.customerInfo.lastName}`,
        customer_address: `${sessionData.customerInfo.address} ${sessionData.customerInfo.address2}, ${sessionData.customerInfo.city}, ${sessionData.customerInfo.state} ${sessionData.customerInfo.zip}`,
        customer_country: sessionData.customerInfo.country,

        // Order Details
        payment_type: sessionData.paymentType,
        main_product: mainProduct,
        upsell_products: upsellProducts,
        total_revenue: totalRevenue,
        main_order_total: mainOrderTotal,
        upsell_total: upsellTotal,
        number_of_upsells: sessionData.upsells?.length || 0,

        // Campaign & Traffic Information
        campaign_id: sessionData.campaignId,
        afid: afid,
        campaign_name: sessionData.customFields?.cf24,
        campaignname: sessionData.customFields?.cf24,
        traffic_source: afid,
        source_url: sessionData.source_url,

        // Attribution Data
        ga_experiment: sessionData.ga_experiment,

        // Timing Information
        created_at: sessionData.createdAt,
        finalized_at: sessionData.finalizedAt,
        order_confirmed_at: sessionData.orderConfirmedAt,

        // Transaction Details

        gateway_id:
          sessionData.orderData?.gateway_id ||
          sessionData.paypalOrder?.gatewayId,

        // Additional Metadata
        ip_address: sessionData.ipAddress,
        user_agent: sessionData.userAgent,
        finalized_by: sessionData.finalizedBy,
        custom_fields: sessionData.customFields,

        // Response Information
        response_code:
          sessionData.orderData?.response_code ||
          sessionData.paypalOrder?.responseCode,
        response_message: sessionData.orderData?.resp_msg,

        // Shopify Integration
        shopify_data: sessionData.shopifyData,
      },
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

type UpsellTrackingData = {
  sessionData: SessionDataType;
  accepted: boolean;
  upsell_sku: string;
  upsell_price: number;
  upsell_page: string;
};

export const trackUpsellResponse = async ({
  sessionData,
  accepted,
  upsell_sku,
  upsell_price,
  upsell_page,
}: UpsellTrackingData): Promise<void> => {
  // Calculate total revenue including upsells
  const mainOrderTotal = parseFloat(
    sessionData?.orderData?.orderTotal ||
      sessionData?.paypalOrder?.orderTotal ||
      "0"
  );
  const upsellTotal = parseFloat(
    sessionData?.upsellOrderData?.orderTotal || "0"
  );
  const totalRevenue = mainOrderTotal + upsellTotal;

  const mainOrderTax = parseFloat(
    sessionData?.orderData?.orderSalesTaxAmount ||
      sessionData?.paypalOrder?.orderSalesTaxAmount ||
      "0"
  );
  const upsellTax = parseFloat(
    sessionData?.upsellOrderData?.orderSalesTaxAmount || "0"
  );
  const totalTax = mainOrderTax + upsellTax;

  const saleTaxPercent = totalTax / totalRevenue;

  // Format products data
  const mainProduct = {
    product_id: sessionData.productId,
    name: sessionData.productName,
    price: parseFloat(sessionData.productPrice || "0"),
    shipping: parseFloat(sessionData.productShipping || "0"),
  };

  // Format upsells using correct structure
  const upsellProducts =
    sessionData.upsells?.map((upsell: UpsellInfoType) => ({
      offer_id: upsell.offerId,
      offer_name: upsell.offerName,
      price: upsell.offerPrice,
      billing_type: upsell.offerBilling,
      offer_offer_id: upsell.offerOfferId,
    })) || [];

  //generate product CSV strings
  const productCSVs = generateProductCSVStrings(sessionData);

  // Extract important custom fields
  const afid = sessionData.customFields?.cf41 || "direct";
  const campaignName = sessionData.customFields?.cf24 || "unknown";

  const eventName = "upsell-response-vercel";

  return new Promise((resolve, reject) => {
    mixpanel.track(
      eventName,
      {
        accepted: accepted,
        upsell_sku: upsell_sku,
        upsell_price: upsell_price,
        upsell_page: upsell_page,
        // Order Identifiers
        distinct_id: sessionData.mixpanel_id,
        ad_name: sessionData.customFields?.cf25,
        adaccount: sessionData.customFields?.cf35,
        adset_name: sessionData.customFields?.cf26,
        affid: sessionData.customFields?.cf42 || "39 - Internal",
        ancestor_id:
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        authorization_id:
          sessionData.orderData?.authId || sessionData.paypalOrder?.customerId,
        bar: "sidecar",
        billing_address: sessionData.customerInfo.address,
        billing_address_2: sessionData.customerInfo.address2,
        billing_city: sessionData.customerInfo.city,
        billing_country: sessionData.customerInfo.country,
        billing_state_id: sessionData.customerInfo.state,
        billing_zip: sessionData.customerInfo.zip,
        browser: sessionData.customFields?.cf2,
        c1: sessionData.customFields?.ff_vid,
        c2: sessionData.customFields?.cf6,
        c3: "see me",
        campaign_desc: "adrian is a pain in my ass",
        cb_service_outcome: "",
        cb_service_source: "",
        cb_service_type: "",
        chk: sessionData.customFields?.cf16,
        chkbtn: "",
        chkord: "",
        cid: "",
        clarity_user_id: sessionData.customFields?.cf19,
        click_id: sessionData.clickId,
        client_id: sessionData.client_id,
        client_user_agent: sessionData.userAgent,
        "Customer ID": sessionData.stickyCustomerId,
        decline_reason: "",
        device: sessionData.userAgent,
        Email: sessionData.customerInfo.email,
        experiment_id: sessionData.customFields?.cf17,
        expi_id2: "",
        fb_browser_id: sessionData.fb_browser_id,
        fb_click_id: sessionData.fb_click_id,
        first_name: sessionData.customerInfo.firstName,
        fnl: sessionData.funnel,
        from: "vercel",
        ftr: "",
        funnel: funnelName,
        funnelflux_hit_id: sessionData.customFields?.cf11,

        gbraid: sessionData.customFields?.cf37,
        initial_referrer: sessionData.customFields?.cf41,
        is_fraud: "0",
        is_recurring: "0",
        is_test_cc: "0",
        ischargeback: "0",
        last_name: sessionData.customerInfo.lastName,
        oid: sessionData.customFields?.cf10,
        "Order ID":
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        order_date: sessionData.orderConfirmedAt,
        order_status: "1",
        order_total: totalRevenue,
        parent_order: "1",
        payment_method: sessionData.paymentType,
        Phone: sessionData.customerInfo.phone,
        post_back_action: "finalized",
        prk: sessionData.customFields?.cf13,
        prkvar: sessionData.customFields?.cf22,
        product_id_csv: productCSVs.product_skus_csv,
        product_names_csv: productCSVs.product_names_csv,
        product_prices_csv: productCSVs.product_prices_csv,
        product_qtys_csv: productCSVs.product_qtys_csv,
        product_skus_csv: productCSVs.product_skus_csv,
        qclid: sessionData.customFields?.cf32,
        rebill_depth: "0",
        recurring_date: "0000-00-00",
        sales_tax_percent: saleTaxPercent,
        shipping_total: sessionData.productShipping,
        sid: "",
        source_id: sessionData.customFields?.cf1,
        sub1: sessionData.customFields?.cf27,
        sub2: sessionData.customFields?.cf28,
        sub3: sessionData.customFields?.cf29,
        sub4: sessionData.customFields?.cf7,
        sub5: sessionData.customFields?.cf34,
        sub_affiliate: "",
        subscription_active_csv: "",
        taxable_amount: totalRevenue - totalTax,
        transaction_id:
          sessionData.orderData?.transactionID ||
          sessionData.paypalOrder?.orderId,
        ups: sessionData.customFields?.cf20,
        utm_device_category: sessionData.customFields?.cf39,
        void_refund_amount: "0.00",
        vwo_uuid: sessionData.customFields?.cf31,
        wbraid: sessionData.customFields?.cf36,

        //don't worry about after here

        order_id:
          sessionData.orderData?.order_id || sessionData.paypalOrder?.orderId,
        session_id: sessionData.billingId,

        // Customer Information
        customer_email: sessionData.customerInfo.email,
        customer_phone: sessionData.customerInfo.phone,
        customer_name: `${sessionData.customerInfo.firstName} ${sessionData.customerInfo.lastName}`,
        customer_address: `${sessionData.customerInfo.address} ${sessionData.customerInfo.address2}, ${sessionData.customerInfo.city}, ${sessionData.customerInfo.state} ${sessionData.customerInfo.zip}`,
        customer_country: sessionData.customerInfo.country,

        // Order Details
        payment_type: sessionData.paymentType,
        main_product: mainProduct,
        upsell_products: upsellProducts,
        total_revenue: totalRevenue,
        main_order_total: mainOrderTotal,
        upsell_total: upsellTotal,
        number_of_upsells: sessionData.upsells?.length || 0,

        // Campaign & Traffic Information
        campaign_id: sessionData.campaignId,
        afid: afid,
        campaign_name: sessionData.customFields?.cf24,
        campaignname: sessionData.customFields?.cf24,
        traffic_source: afid,
        source_url: sessionData.source_url,

        // Attribution Data
        ga_experiment: sessionData.ga_experiment,

        // Timing Information
        created_at: sessionData.createdAt,
        finalized_at: sessionData.finalizedAt,
        order_confirmed_at: sessionData.orderConfirmedAt,

        // Transaction Details

        gateway_id:
          sessionData.orderData?.gateway_id ||
          sessionData.paypalOrder?.gatewayId,

        // Additional Metadata
        ip_address: sessionData.ipAddress,
        user_agent: sessionData.userAgent,
        finalized_by: sessionData.finalizedBy,
        custom_fields: sessionData.customFields,

        // Response Information
        response_code:
          sessionData.orderData?.response_code ||
          sessionData.paypalOrder?.responseCode,
        response_message: sessionData.orderData?.resp_msg,

        // Shopify Integration
        shopify_data: sessionData.shopifyData,
      },
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};
