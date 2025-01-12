"use client";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import React, { useState, useEffect } from "react";

type Props = {
  info: CheckoutPageType;
  activateCoupon: () => void;
  showPop: boolean;
  setShowPop: (value: boolean) => void;
  formik: any;
  initialCustomerInfo: any;
  showPaypalPop: boolean;
  loading: string;
};

const CheckoutCouponPop = ({
  info,
  activateCoupon,
  showPop,
  setShowPop,
  formik,
  initialCustomerInfo,
  showPaypalPop,
  loading,
}: Props) => {
  const [showOnce, setShowOnce] = useState(false);
  const [mins, setMins] = useState(3);
  const [secs, setSecs] = useState(0);
  const [expiredText, setExpiredText] = useState(
    "Offer Expired - Request Extension"
  );

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

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const extendTime = async () => {
    setExpiredText("Request Granted - 2 Extra Minutes");
    await delay(2000);
    setMins(2);
    await delay(1000);
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
      (key) =>
        currentValues[key] !== initialValues[key] && currentValues[key] !== ""
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
      setTimeout(() => {
        document.getElementById("coupon-pop-up")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
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
          className="absolute z-50 md:z-40 bg-black/30 flex w-full px-4 h-full justify-center items-start pt-10"
          id="coupon-pop-up"
        >
          <div className="bg-[#ffe300] flex flex-col w-full max-w-[700px] items-center  pb-10 text-center rounded-lg border-red-600 border-4">
            <div className="flex w-full justify-end">
              <div
                className="bg-black border-[3px] border-white rounded-full flex items-center justify-center font-[600] h-[30px] w-[30px] text-white mr-[-15px] mt-[-15px] text-[22px] cursor-pointer hover:bg-[#444]"
                onClick={() => setShowPop(false)}
              >
                X
              </div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <p className="text-[30px] font-bold uppercase mt-6">WAIT!</p>
              <p className="text-[24px] font-bold text-blue-800 py-4">
                Save an extra ${info.product.couponValue} OFF on top of the 56%
                discount with this free coupon!
              </p>
              <p className="text-[18px]">
                Congratulations! This is a special promotion that only 5 lucky
                visitors get per week. You must use this coupon within the next
                3 minutes or it will be given away to another customer.
              </p>
              <div className="w-[200px]  rounded-md text-black text-[30px]   font-[600] flex items-center justify-center mt-4">
                {formatTime(mins)} : {formatTime(secs)}
              </div>
              <div className="w-[200px]  rounded-md text-[#333] text-[12px]  flex items-center justify-center ">
                Minutes <span className="ml-4">Seconds</span>
              </div>
              {mins === 0 && secs === 0 ? (
                <button
                  className=" bg-[#fd594d] text-[18px] uppercase  px-6 py-4 mt-4 rounded-lg text-white font-bold green-text-shadow border-b-[3px] border-red-700 cursor-pointer hover:bg-red-600"
                  onClick={extendTime}
                >
                  {expiredText}
                </button>
              ) : (
                <button
                  className="text-[18px] uppercase bg-[#29af5c] px-6 py-4 mt-4 rounded-lg text-white font-bold green-text-shadow border-b-[3px] border-[#128e41] cursor-pointer hover:bg-[#0ebf52] disabled:opacity-40 disabled:cursor-not-allowed "
                  onClick={activateCoupon}
                >
                  <p>Activate ${info.product.couponValue} OFF Coupon!</p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutCouponPop;
