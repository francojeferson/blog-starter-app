import React from "react";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type Props2 = {
  firePaypal: () => void;
  loading: string;
};

const CheckoutMobilePaymentOptions2 = ({ firePaypal, loading }: Props2) => {
  return (
    <>
      <div className="flex w-full justify-start items-center pb-4">
        <GlobeAmericasIcon className="h-4 w-4 mr-2" />
        <h3 className="font-bold text-base">Step 3: Payment Options</h3>
      </div>

      {/* Row with card logos */}
      <div className="flex items-center mb-2 space-x-2">
        <div className="flex items-center border border-green-500 rounded-md px-2 py-1 cursor-pointer space-x-2">
          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/60ac8520-9b26-4b76-8cf0-4d4fd5d52800/public"
            width={45}
            height={20}
            alt="Visa"
            className="object-scale-down"
          />

          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/e95314d5-1adc-477b-1631-38162b91ad00/public"
            width={45}
            height={20}
            alt="Mastercard"
            className="object-scale-down border-x border-gray-300 px-2"
          />

          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/5e7d79a8-f00e-4ea8-7aac-3484c20e7e00/public"
            width={45}
            height={20}
            alt="American Express"
            className="object-scale-down"
          />
        </div>
      </div>

      {/* PayPal button */}
      <div
        className="flex items-center border border-[#ffc439] bg-[#ffc439] rounded-md px-2 py-1 h-[44px] cursor-pointer hover:bg-[#ffde3a]"
        onClick={() => {
          if (loading === "") {
            firePaypal();
          }
        }}
      >
        <Image
          src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/1397951e-7288-4b95-8ef1-b1f423b56c00/public"
          width={140}
          height={44}
          alt="Paypal"
          className="object-scale-down "
        />
      </div>
    </>
  );
};

export default CheckoutMobilePaymentOptions2;
