import React from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { useSession } from "@/app/_context/SessionContext";
import { delay } from "@/app/_utils/delay";
import Image from "next/image";
import { createJimmyKey } from "@/app/_utils/jimmyKeyUtils";

type Props = {
  info: CheckoutPageType;
  showPaypalPop: boolean;
  setShowPaypalPop: (value: boolean) => void;
  setLoading: (value: string) => void;
  firePaypal: () => void;
};
const PaypalPop = ({
  info,
  showPaypalPop,
  setShowPaypalPop,
  setLoading,
  firePaypal,
}: Props) => {
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
        const reportError = await fetch("/api/utility/send-slack-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jimmy-key": createJimmyKey().encryptedData,
          },
          body: JSON.stringify({
            message: "Error Starting PayPal Purchase - Checkout Page",
            errorDetails: response.statusText,
            userInfo: { sessionId },
          }),
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.redirectUrl) {
        setLoading("Redirecting to PayPal");
        await delay(500);
        // Redirect to the URL provided in the response
        window.location.href = data.redirectUrl;
      } else if (data && data.htmlContent) {
        // Render the HTML content in a specified container
        document.getElementById("payment-container")!.innerHTML =
          data.htmlContent;
        setLoading(""); // Stop loading as the content is now rendered
      } else {
        // Handle the case where no redirect or HTML content is provided
        setLoading("Error with PayPal. Please try again.");
        setTimeout(() => {
          setLoading("");
        }, 2000);
      }
    } catch (error) {
      setLoading("Error with PayPal. Please try again.");
      setTimeout(() => {
        setLoading("");
      }, 2000);
    }
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      firePaypal();
    }
  };

  const totalPrice =
    parseFloat(info.product.price4) - parseFloat(info.product.couponValue);

  return (
    <>
      {showPaypalPop && (
        <div
          className="absolute z-50 bg-black/30 flex w-full px-4 h-full justify-center items-start pt-10"
          id="paypal-pop-up"
          onClick={handleBgClick}
        >
          <div className="bg-[#fff]  flex flex-col w-full max-w-[700px] items-center  pb-4 text-center rounded-lg border-[#003087] border-4">
            <div className="flex w-full justify-end">
              <div
                className="bg-[#222] border-[3px] border-[#003087] rounded-full flex items-center justify-center font-[600] h-[30px] w-[30px] text-[#009cde] mr-[-15px] mt-[-15px] text-[22px] cursor-pointer hover:bg-[#444]"
                onClick={handleBgClick}
              >
                X
              </div>
            </div>
            <div className="px-4 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center text-[#006fe0] mt-2 sm:mt-6 mb-2">
                <Image
                  src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/1397951e-7288-4b95-8ef1-b1f423b56c00/public"
                  width={140}
                  height={100}
                  alt="PayPal Logo"
                  className=" mr-4"
                />
                <div className="text-[24px] uppercase font-bold italic mt-2 sm:mt-0">
                  Exclusive Offer!
                </div>
              </div>
              <p className="text-[18px] sm:text-[22px] font-bold uppercase mt-2 sm:mt-8 text-[#003087]">
                Free Shipping +{" "}
                <span className="underline text-[#006fe0]">60% Off</span> +{" "}
                <span className="underline text-[#f00000]">
                  Bonus $5 Off Coupon
                </span>
              </p>
              <div className="flex w-full mt-4 sm:mt-8 flex-wrap">
                <div className="w-full sm:w-1/3 flex items-center justify-center">
                  <Image
                    src={info.product.image4}
                    width={120}
                    height={120}
                    alt={info.product.name}
                    className="max-w-full"
                  />
                </div>
                <div className="w-full sm:w-2/3 flex items-center sm:items-start flex-col justify-center text-center sm:text-left">
                  <h5 className="text-[18px] font-bold">
                    4x {info.product.name}
                  </h5>
                  <p className="text-[16px] text-[#003087]">
                    <span className="text-[#c5c5c5] font-bold line-through">
                      {info.product.ogPrice4}+{" "}
                    </span>
                    <span className="font-bold text-[#006fe0]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="text-[18px] uppercase bg-[#29af5c] w-full py-8 mt-4 px-2  sm:mt-8 rounded-lg text-white font-bold green-text-shadow border-b-[3px] border-[#128e41] cursor-pointer hover:bg-[#0ebf52]"
                onClick={firePaypalUpsell}
              >
                Upgrade Your Order!
              </button>
              <button
                className="bg-transparent border-none  mt-4 text-[12px] md:text-[16px] pb-2 max-w-[900px] text-[#a1a1a1] hover:underline"
                onClick={firePaypal}
              >
                No thank you, I would not like to get this exclusive discount.
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaypalPop;
