import React from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { useSession } from "@/app/_context/SessionContext";
import { delay } from "@/app/_utils/delay";
import Image from "next/image";
import { createJimmyKey } from "@/app/_utils/jimmyKeyUtils";

type Props2 = {
  info: CheckoutPageType;
  showPaypalPop: boolean;
  setShowPaypalPop: (value: boolean) => void;
  setLoading: (value: string) => void;
  firePaypal: () => void;
};
const PaypalPop2 = ({ info, showPaypalPop, setShowPaypalPop, setLoading, firePaypal }: Props2) => {
  const { sessionId } = useSession();

  const firePaypalUpsell = async () => {
    setShowPaypalPop(false);
    setLoading("Connecting to PayPal");
    try {
      const response = await fetch("/api/session/start-paypal-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jimmy-key": createJimmyKey().encryptedData,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          product: 3,
          productId: info.product.stickyId4,
          productName: `4x ${info.product.name}`,
          productPrice: info.product.price4,
          productShipping: "0.00",
          shippingId: "3",
          campaignId: info.stickyCampaign,
          promoCode: "5OFFPOP",
          alt_pay_return_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/upsell1`,
        }),
      });

      if (!response.ok) {
        // handle error
        setLoading("Error with PayPal. Please try again.");
        return;
      }

      const data = await response.json();

      if (data && data.redirectUrl) {
        setLoading("Redirecting to PayPal");
        await delay(500);
        window.location.href = data.redirectUrl; // go to PayPal
      } else if (data && data.htmlContent) {
        document.getElementById("payment-container")!.innerHTML = data.htmlContent;
        setLoading("");
      } else {
        setLoading("Error with PayPal. Please try again.");
      }
    } catch (error) {
      setLoading("Error with PayPal. Please try again.");
    }
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      firePaypal();
    }
  };

  const totalPrice = parseFloat(info.product.price4) - parseFloat(info.product.couponValue);

  return (
    <>
      {showPaypalPop && (
        <div
          className="absolute z-50 bg-black/40 flex w-full px-4 h-full justify-center items-start pt-10"
          onClick={handleBgClick}
        >
          <div className="bg-white flex flex-col w-full max-w-md items-center pb-6 text-center rounded-lg border-[#003087] border-4">
            <div className="flex w-full justify-end">
              <div
                className="bg-gray-700 border-2 border-[#003087] rounded-full flex items-center justify-center text-white font-bold h-8 w-8 mr-[-15px] mt-[-15px] text-lg cursor-pointer"
                onClick={handleBgClick}
              >
                X
              </div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center text-[#006fe0] mt-2 sm:mt-6 mb-2">
                <Image
                  src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/1397951e-7288-4b95-8ef1-b1f423b56c00/public"
                  width={100}
                  height={40}
                  alt="PayPal Logo"
                  className="mr-2"
                />
                <div className="text-xl uppercase font-bold italic mt-2 sm:mt-0">Exclusive Offer!</div>
              </div>
              <p className="text-lg font-bold uppercase mt-2 text-[#003087]">
                Free Shipping + <span className="underline text-blue-600">60% Off</span> +{" "}
                <span className="underline text-red-600">Bonus $5 Off Coupon</span>
              </p>
              <div className="flex flex-col w-full mt-4 sm:mt-8 items-center">
                <Image
                  src={info.product.image4}
                  width={120}
                  height={120}
                  alt={`${info.product.name}`}
                  className="object-contain"
                />
                <h5 className="text-lg font-bold mt-2">4x {info.product.name}</h5>
                <p className="text-sm text-gray-700">
                  <span className="text-gray-400 line-through mr-1">{info.product.ogPrice4}</span>
                  <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button
                className="bg-[#29af5c] text-white font-bold text-lg w-full py-3 mt-4 rounded hover:bg-green-700"
                onClick={firePaypalUpsell}
              >
                Upgrade Your Order!
              </button>
              <button className="bg-transparent text-xs pt-3 text-gray-500 hover:underline" onClick={firePaypal}>
                No thanks, I'll just proceed without this.
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaypalPop2;
