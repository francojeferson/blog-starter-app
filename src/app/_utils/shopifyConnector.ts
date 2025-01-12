import { SessionDataType } from "@/interfaces/sessionData";
import { productToShopifyMapping } from "@/lib/product-to-shopify";
import { shopifyStore } from "@/lib/site-info";
import sendToSegment from "./segmentConnector";

const SHOPIFY_API_URL = `https://${shopifyStore}/admin/api/2023-04/orders.json`;
const SHOPIFY_ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
export async function createShopifyOrder(
  sessionData: SessionDataType
): Promise<void> {
  try {
    const orderData =
      sessionData.paymentType === "paypal"
        ? buildShopifyOrderDataForPaypal(sessionData)
        : buildShopifyOrderData(sessionData);

    sendToSegment({ orderData, sessionData });

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + btoa(`${SHOPIFY_API_KEY!}:${SHOPIFY_ADMIN_API_KEY!}`),
      },
      body: JSON.stringify({ order: orderData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shopify order created.");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating Shopify order:", error.message);
      if ("response" in error) {
        const responseError = error as {
          response?: { status?: number; statusText?: string; data?: any };
        };
        console.error("Shopify API Error:", {
          status: responseError.response?.status,
          statusText: responseError.response?.statusText,
          data: responseError.response?.data,
        });
      }
    } else {
      console.error("Unknown error creating Shopify order:", error);
    }
    return;
  }
}

const buildShopifyOrderDataForPaypal = (sessionData: SessionDataType) => {
  const isDeclined = sessionData.paypalOrder?.errorFound !== "0";
  const totalTax = calculateTotalTax(sessionData);
  const lineItems = buildLineItems(sessionData, totalTax);
  const totalPrice = calculateTotalPaypalPrice(sessionData);

  return {
    line_items: lineItems,
    customer: buildCustomerData(sessionData),
    shipping_address: buildAddressData(sessionData),
    billing_address: buildAddressData(sessionData),
    financial_status: isDeclined ? "voided" : "paid",
    total_tax: totalTax.toFixed(2),
    currency: "USD",
    note: `The PayPal orderid (buysplashcleaner) is ${sessionData.paypalOrder?.orderId}`,
    tags: isDeclined ? ["declined"] : ["success"],
    total_price: totalPrice,
    shipping_lines: [
      {
        price: sessionData.productShipping,
        title: `Shipping ${sessionData.productShipping}`,
      },
    ],
    transactions: [
      {
        kind: "sale",
        status: isDeclined ? "failure" : "success",
        amount: totalPrice,
      },
    ],
  };
};

function buildShopifyOrderData(sessionData: SessionDataType): any {
  const isDeclined = sessionData.orderData?.response_code !== "100";
  const totalTax = parseFloat(
    sessionData.orderData?.orderSalesTaxAmount || "0.00"
  );
  const lineItems = buildLineItems(sessionData, totalTax);
  const totalPrice = calculateTotalPrice(sessionData);

  return {
    line_items: lineItems,
    customer: buildCustomerData(sessionData),
    shipping_address: buildAddressData(sessionData),
    billing_address: buildAddressData(sessionData),
    financial_status: isDeclined ? "voided" : "paid",
    total_tax: totalTax.toFixed(2),
    currency: "USD",
    note: `The sticky.io orderid (buysplashcleaner) is ${sessionData.orderData?.order_id}`,
    tags: isDeclined ? ["declined"] : ["success"],
    total_price: totalPrice,
    shipping_lines: [
      {
        price: sessionData.productShipping,
        title: `Shipping ${sessionData.productShipping}`,
      },
    ],
    transactions: [
      {
        kind: "sale",
        status: isDeclined ? "failure" : "success",
        amount: totalPrice,
      },
    ],
  };
}

function buildLineItems(sessionData: SessionDataType, totalTax: number): any[] {
  let lineItems = [
    buildLineItem(sessionData.productId, 1, sessionData.productPrice),
  ];

  if (sessionData.upsells && Array.isArray(sessionData.upsells)) {
    sessionData.upsells.forEach((upsell) => {
      lineItems.push(
        buildLineItem(upsell.offerId, 1, upsell.offerPrice.toString())
      );
    });
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  lineItems = lineItems.map((item) => {
    const itemTotal = parseFloat(item.price) * item.quantity;
    const itemTax = (itemTotal / subtotal) * totalTax;
    item.tax_lines[0].price = itemTax.toFixed(2);
    item.tax_lines[0].rate = (itemTax / itemTotal).toFixed(4);
    return item;
  });

  return lineItems;
}

function buildLineItem(
  productId: string,
  quantity: number,
  price: string
): any {
  const product = productToShopifyMapping.find(
    (p) => p.productId.toString() === productId.toString()
  );

  if (!product) {
    throw new Error(`Product not found for ID: ${productId}`);
  }

  return {
    variant_id: product.variantId,
    quantity: quantity,
    price: price,
    title: product.title,
    tax_lines: [
      {
        price: "0.00",
        rate: 0,
        title: "Sales Tax",
      },
    ],
  };
}

function calculateTotalPrice(sessionData: SessionDataType): string {
  return sessionData.orderData?.orderTotal || "0.00";
}

const calculateTotalPaypalPrice = (sessionData: SessionDataType): string => {
  const firstOrderTotal = parseFloat(
    sessionData.paypalOrder?.orderTotal || "0.00"
  );
  const upsellOrderTotal = parseFloat(
    sessionData.upsellOrderData?.orderTotal || "0.00"
  );
  const total = firstOrderTotal + upsellOrderTotal;
  return total.toFixed(2);
};

const calculateTotalTax = (sessionData: SessionDataType): number => {
  const firstOrderTax = parseFloat(
    sessionData.paypalOrder?.orderSalesTaxAmount || "0.00"
  );
  const upsellOrderTax = parseFloat(
    sessionData.upsellOrderData?.orderSalesTaxAmount || "0.00"
  );
  return firstOrderTax + upsellOrderTax;
};

const buildCustomerData = (sessionData: SessionDataType) => ({
  first_name: sessionData.customerInfo.firstName,
  last_name: sessionData.customerInfo.lastName,
  email: sessionData.customerInfo.email,
});

const buildAddressData = (sessionData: SessionDataType) => ({
  first_name: sessionData.customerInfo.firstName,
  last_name: sessionData.customerInfo.lastName,
  address1: sessionData.customerInfo.address,
  address2: sessionData.customerInfo.address2,
  phone: sessionData.customerInfo.phone,
  city: sessionData.customerInfo.city,
  province: sessionData.customerInfo.state,
  country: sessionData.customerInfo.country,
  zip: sessionData.customerInfo.zip,
});
