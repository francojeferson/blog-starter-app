"use client";
import React, { useState, useEffect } from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

// ========== Imports for Reusable Components ==========
import AnnouncementBar from "./checkout-announcement-bar";
import DiscountBar2 from "./checkout-discount-bar-2";
import QuantitySelector2 from "./checkout-quantity-selector-2";
import CustomerInfo2 from "./checkout-customer-info-2";
import PaymentOptions2 from "./checkout-payment-options-2";
import CheckoutMobilePaymentOptions2 from "./checkout-mobile-payment-options-2";
import CheckoutCouponPop2 from "./checkout-coupon-pop-2";
import PaypalPop2 from "./checkout-paypal-pop-2";
import HandleSessionStart from "./checkout-handle-session-start";

// ========== Utility Imports ==========
import { useSession } from "@/app/_context/SessionContext";
import { useTracking } from "@/app/_context/TrackingContext";
import { delay } from "@/app/_utils/delay";
import { emergencyStartSession } from "@/app/_utils/emergencySessionStart";
import { encryptCreditCard } from "@/app/_utils/encryptUtils";
import { sendGAEvent } from "@next/third-parties/google";

// ========== Interfaces / Types ==========
import { ProductInfoType } from "@/interfaces/productInfo";
import { CustomerInfoType } from "@/interfaces/customerInfo";

type Props = {
  info: CheckoutPageType;
};

const CheckoutForm2 = ({ info }: Props) => {
  const router = useRouter();
  const { sessionId, setSessionId, confirmOrder } = useSession();
  const { ffVid, hitId } = useTracking();

  // Query String Storage
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryObj: { [key: string]: string | string[] } = {};

    searchParams.forEach((value, key) => {
      if (queryObj[key]) {
        if (Array.isArray(queryObj[key])) {
          (queryObj[key] as string[]).push(value);
        } else {
          queryObj[key] = [queryObj[key] as string, value];
        }
      } else {
        queryObj[key] = value;
      }
    });

    const encoded = Object.entries(queryObj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
      })
      .join("&");

    setQueryString(encoded);
  }, []);

  // Loading & Popups
  const [loading, setLoading] = useState("");
  const [showPop, setShowPop] = useState(false);
  const [showPaypalPop, setShowPaypalPop] = useState(false);

  // Country
  const [country, setCountry] = useState("US");

  // Product Setup
  const [product, setProduct] = useState<ProductInfoType>({
    product: 1,
    productName: `2x ${info.product.name}`,
    productPrice: `${info.product.price2}`,
    productShipping: `${info.product.ship2}`,
    productShippingId: `${info.product.shippingId2}`,
    productOfferId: `${info.product.offerId2}`,
    productStickyId: `${info.product.stickyId2}`,
  });

  // Customer Info
  const initialCustomerInfo: CustomerInfoType = {
    sessionId: sessionId || "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "US",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    card: "",
    month: "",
    year: "",
    cvv: "",
    couponActive: false,
    couponValue: info.product.couponValue,
  };
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>(initialCustomerInfo);

  // Regex for ZIP codes
  const zipRegexes: { [key: string]: RegExp } = {
    US: /^\d{5}(-\d{4})?$/, // United States: 12345 or 12345-6789
    AU: /^\d{4}$/, // Australia: 1234
    CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i, // Canada: A1A 1A1
    FI: /^\d{5}$/, // Finland: 12345
    FR: /^\d{5}$/, // France: 12345
    DE: /^\d{5}$/, // Germany: 12345
    IS: /^\d{3}$/, // Iceland: 123
    IE: /^[A-Z]\d{2}[A-Z\d]?[A-Z]?( \d{4})?$/i, // Ireland: A12 B3CD or A12 1234
    IL: /^\d{5}(\d{2})?$/, // Israel: 1234567 or 12345
    NZ: /^\d{4}$/, // New Zealand: 1234
    NO: /^\d{4}$/, // Norway: 1234
    SE: /^\d{3}[ ]?\d{2}$/, // Sweden: 123 45 or 12345
    GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // United Kingdom: AB1 2CD or AB12 3CD
  };

  // Formik + Yup for form validation
  const formik = useFormik({
    initialValues: customerInfo,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      address2: Yup.string(),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: Yup.string()
        .test("zip", "Invalid Postal/ZIP code", function (value) {
          if (!value) return false;
          const country = this.parent.country as string;
          const regex = zipRegexes[country] || /.+/;
          return regex.test(value);
        })
        .required("Postal/ZIP code is required"),
      card: Yup.string()
        .matches(/^[0-9]{13,19}$/, "Card number must be 13-19 digits")
        .required("Card Number is required"),
      cvv: Yup.string()
        .matches(/^[0-9]{3,4}$/, "CVV must be 3-4 digits")
        .required("CVV is required"),
      month: Yup.string().required("Expiry Month is required"),
      year: Yup.string().required("Expiry Year is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading("Processing Payment");
        // Start session if needed
        let mysessionId = sessionId;
        if (!mysessionId) {
          const newSessionId = await emergencyStartSession(info, product, setSessionId, ffVid || "", hitId || "");
          if (!newSessionId) {
            setLoading("Error - Please Refresh Page");
            return;
          }
          mysessionId = newSessionId;
        }

        // Encrypt card data
        const encryptedCard = encryptCreditCard(values.card);
        const encryptedCVV = encryptCreditCard(values.cvv);

        // For demonstration, do a simple console log or confirmPurchase call
        console.log("Template2 Submitting Payment with values:", values);
        console.log("Encrypted Card:", encryptedCard.encryptedData);

        confirmOrder(); // finalize the purchase in context
        sendGAEvent("event", "start_credit_card_order_template2", {
          sessionId: mysessionId,
        });
        setLoading("Order Confirmed (Template2)");

        // Emulate redirect after success
        setTimeout(() => {
          router.push(`/checkout/upsell1?${queryString}`);
        }, 1500);
      } catch (error) {
        setLoading("Error Processing Payment");
        setTimeout(() => {
          setLoading("");
        }, 2000);
      }
    },
  });

  // ========== Utility Functions (Coupon, PayPal, etc.) ==========
  const activateCoupon = async () => {
    if (!customerInfo.couponActive) {
      setShowPop(false);
      await delay(200);
      setCustomerInfo({ ...customerInfo, couponActive: true });
    }
  };

  const firePaypal = async () => {
    console.log("Template2: Firing PayPal");
    confirmOrder();
    setShowPaypalPop(false);
    setLoading("Connecting to PayPal...");
    setTimeout(() => {
      setLoading("Redirecting to PayPal...");
    }, 1200);
  };

  // Detect user country (if needed)
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Example only
        const detected = "US";
        setCustomerInfo({ ...customerInfo, country: detected });
        formik.setFieldValue("country", detected);
        setCountry(detected);
      } catch (err) {
        console.error("Error fetching geolocation:", err);
      }
    };
    detectCountry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* (Optional) Session Start Handling */}
      <HandleSessionStart info={info} setCustomerInfo={setCustomerInfo} product={product} />

      {/* For PayPal if it injects HTML */}
      <div id="payment-container" />

      {/* Page Container: matches Oricle's bright background */}
      <div className="flex w-full relative flex-col items-center bg-[#f1f4f8]">
        {/* 1) Announcement Bar (similar to Oricle) */}
        <AnnouncementBar />

        {/* 2) Two-column layout for main content */}
        <div className="flex w-full max-w-screen-lg sm:px-4 pb-12 flex-wrap">
          {/* LEFT Column: Select Quantity, Discount Info, and Quick Checkout */}
          <div className="flex flex-col w-full lg:w-1/2 px-2 lg:py-8 pt-4 sm:pt-8 pb-4">
            {/* A) Select Quantity + Discount Info */}
            <div className="bg-white p-4 rounded-md border border-gray-300">
              <DiscountBar2
                product={product.product}
                info={info}
                couponActive={customerInfo.couponActive}
                country={country}
              />
            </div>

            <div className="bg-white p-4 mt-4 rounded-md border border-gray-300">
              <QuantitySelector2
                product={product}
                info={info}
                setProduct={setProduct}
                couponActive={customerInfo.couponActive}
                country={country}
              />
            </div>

            {/* B) Mobile Express Checkout (PayPal button, etc.) */}
            <div className="bg-white p-4 mt-4 rounded-md border border-gray-300 lg:hidden">
              <CheckoutMobilePaymentOptions2 firePaypal={firePaypal} loading={loading} />
            </div>

            {/* C) Basic Customer Info (name, email, phone, shipping) */}
            <div className="bg-white p-4 mt-4 rounded-md border border-gray-300">
              <CustomerInfo2 formik={formik} />
            </div>
          </div>

          {/* Right column: Payment (credit card fields, finalize purchase) */}
          <div className="flex flex-col w-full lg:w-1/2 px-2 lg:py-8">
            <div className="bg-white p-4 rounded-md border border-gray-300">
              <PaymentOptions2
                info={info}
                product={product}
                formik={formik}
                loading={loading}
                firePaypal={firePaypal}
                country={country}
                setCountry={setCountry}
              />
            </div>
          </div>
        </div>

        {/* 3) Pop-ups */}
        {/* A) Coupon */}
        <CheckoutCouponPop2
          info={info}
          activateCoupon={activateCoupon}
          showPop={showPop}
          setShowPop={setShowPop}
          formik={formik}
          initialCustomerInfo={initialCustomerInfo}
          showPaypalPop={showPaypalPop}
          loading={loading}
        />

        {/* B) PayPal */}
        <PaypalPop2
          info={info}
          showPaypalPop={showPaypalPop}
          setShowPaypalPop={setShowPaypalPop}
          setLoading={setLoading}
          firePaypal={firePaypal}
        />
      </div>
    </>
  );
};

export default CheckoutForm2;
