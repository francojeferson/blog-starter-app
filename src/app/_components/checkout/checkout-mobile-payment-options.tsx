import React from "react";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type Props = {
  firePaypal: () => void;
  loading: string;
};

const CheckoutMobilePaymentOptions = ({ firePaypal, loading }: Props) => {
  return (
    <>
      <div className="flex w-full justify-start items-center pb-4">
        <GlobeAmericasIcon className="h-[16px] w-[16px] mr-2" />
        <h3 className="font-bold text-[16px]">Step 2: Payment Options</h3>
      </div>
      <div className="flex w-full justify-start">
        <input type="radio" checked className="mr-2 cursor-pointer" readOnly />{" "}
        <div className="flex w-[278px] border-[1px] border-[#1ac70e] rounded-md  px-4 py-2 h-[44px] cursor-pointer overflow-hidden space-x-2 hover:bg-[#ddd]">
          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/60ac8520-9b26-4b76-8cf0-4d4fd5d52800/public"
            width={50}
            height={20}
            alt="Visa"
            className="object-scale-down w-1/3"
          />

          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/e95314d5-1adc-477b-1631-38162b91ad00/public"
            width={50}
            height={20}
            alt="Mastercard"
            className="object-scale-down  w-1/3 border-r-[1px] border-l-[1px] px-2 border-[#ccc]"
          />

          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/5e7d79a8-f00e-4ea8-7aac-3484c20e7e00/public"
            width={50}
            height={20}
            alt="American Express"
            className="object-scale-down  w-1/3"
          />
        </div>
      </div>
      <div className="flex w-full justify-start mt-2 mb-2">
        <input
          type="radio"
          checked={false}
          className="mr-2 cursor-pointer  "
          readOnly
          onClick={() => {
            if (loading === "") {
              firePaypal();
            }
          }}
        />
        <div
          className="flex w-[278px] border-[1px] border-[#ffc439] bg-[#ffc439] rounded-md  px-4 py-2 h-[44px] cursor-pointer overflow-hidden space-x-2 hover:bg-[#ffde3a] hover:border-[#ffde3a]"
          onClick={() => {
            if (loading === "") {
              firePaypal();
            }
          }}
        >
          <Image
            src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/1397951e-7288-4b95-8ef1-b1f423b56c00/public"
            width={278}
            height={44}
            alt="Paypal"
            className="cursor-pointer hover:brightness-110 object-scale-down "
          />
        </div>
      </div>
    </>
  );
};

export default CheckoutMobilePaymentOptions;
