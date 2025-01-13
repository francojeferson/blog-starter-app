"use client";
import React, { useState, useEffect } from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";

type Props2 = {
  info: CheckoutPageType;
  activateCoupon: () => void;
  showPop: boolean;
  setShowPop: (value: boolean) => void;
  formik: any;
  initialCustomerInfo: any;
  showPaypalPop: boolean;
  loading: string;
};

const CheckoutCouponPop2 = ({
  info,
  activateCoupon,
  showPop,
  setShowPop,
  formik,
  initialCustomerInfo,
  showPaypalPop,
  loading,
}: Props2) => {
  const [showOnce, setShowOnce] = useState(false);
  const [mins, setMins] = useState(3);
  const [secs, setSecs] = useState(0);
  const [expiredText, setExpiredText] = useState("Offer Expired - Request Extension");

  useEffect(() => {
    const timer = setInterval(() => {
      if (secs > 0) {
        setSecs(secs - 1);
      } else if (mins > 0) {
        setMins(mins - 1);
        setSecs(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mins, secs]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const delayMs = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const extendTime = async () => {
    setExpiredText("Request Granted - 2 Extra Minutes");
    await delayMs(2000);
    setMins(2);
    await delayMs(1000);
    setExpiredText("Offer Expired - Request Extension");
  };

  const removeSessionId = (values: any) => {
    const { sessionId, ...rest } = values;
    return rest;
  };

  const isFormDirty = () => {
    const currentValues = removeSessionId(formik.values);
    const initialValues = removeSessionId(initialCustomerInfo);

    return Object.keys(currentValues).some(
      (key) => currentValues[key] !== initialValues[key] && currentValues[key] !== "",
    );
  };

  const handleMouseLeave = (event: MouseEvent) => {
    if (isFormDirty()) {
      return;
    }
    if (window.innerWidth <= 740) {
      return;
    }
    if (showOnce) {
      return;
    }
    if (showPaypalPop) {
      return;
    }
    if (loading !== "") {
      return;
    }

    const timer = setTimeout(() => {
      setMins(3);
      setSecs(0);
      setShowPop(true);
      setShowOnce(true);
    }, 500);

    const clearTimer = () => clearTimeout(timer);
    document.addEventListener("mouseenter", clearTimer, { once: true });
  };

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [formik.values, showOnce]);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setShowPop(false);
    }
  };

  return (
    <>
      {showPop && !showPaypalPop && loading === "" && (
        <div
          className="absolute z-50 bg-black/40 flex w-full px-4 h-full justify-center items-start pt-10"
          onClick={handleBgClick}
        >
          <div className="bg-yellow-300 flex flex-col w-full max-w-md items-center pb-6 text-center rounded-lg border-red-600 border-4 shadow-md">
            <div className="flex w-full justify-end">
              <div
                className="bg-black border-2 border-white rounded-full flex items-center justify-center font-bold h-8 w-8 text-white mr-[-12px] mt-[-12px] text-lg cursor-pointer hover:bg-gray-600"
                onClick={() => setShowPop(false)}
              >
                X
              </div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <p className="text-3xl font-extrabold uppercase mt-4">WAIT!</p>
              <p className="text-xl font-bold text-blue-800 py-2">
                Save an extra ${info.product.couponValue} on top of your discount!
              </p>
              <p className="text-sm">
                This deal is reserved for the next{" "}
                <span className="text-red-600 font-bold">
                  {formatTime(mins)}:{formatTime(secs)}
                </span>{" "}
                minutes only!
              </p>
              {mins === 0 && secs === 0 ? (
                <button className=" bg-red-500 text-white font-bold py-2 px-4 mt-4 rounded" onClick={extendTime}>
                  {expiredText}
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white font-bold py-2 px-4 mt-4 rounded hover:bg-green-700"
                  onClick={activateCoupon}
                >
                  Activate ${info.product.couponValue} OFF Now!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutCouponPop2;
