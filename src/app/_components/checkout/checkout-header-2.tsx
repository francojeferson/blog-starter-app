import React from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import Image from "next/image";
import { siteProduct } from "@/lib/site-info";

type Props = {
  info: CheckoutPageType;
};

const CheckoutHeader2 = ({ info }: Props) => {
  return (
    <div className="flex w-full relative flex-col items-center">
      {/* Background image (if desired) */}
      <div className="flex w-full relative">
        <Image
          src={info.header.background}
          alt="background"
          fill
          className="absolute top-0 z-0 object-cover"
          priority
        />
        <div className="flex w-full justify-center z-10 py-4">
          <div className="flex w-full max-w-[1100px] px-4 flex-col lg:flex-row">
            {/* Left: Product Image (desktop only) */}
            <div className="hidden lg:flex w-1/2 justify-start items-center">
              <Image src={info.header.product} alt={siteProduct} width={300} height={300} priority />
            </div>

            {/* Right: Logo + Badge */}
            <div className="flex w-full lg:w-1/2 lg:justify-end justify-center items-center space-x-2 lg:space-x-0">
              <Image
                src={info.header.logo}
                alt={siteProduct}
                width={200}
                height={120}
                className="w-1/2 sm:w-auto lg:mr-[60px] max-w-1/2 object-scale-down"
                priority
              />
              <Image
                src={info.header.badge}
                alt={siteProduct}
                width={130}
                height={130}
                className="w-1/2 sm:w-auto max-w-[130px] object-scale-down"
                priority
              />
            </div>

            {/* Product Image for mobile only */}
            <div className="flex lg:hidden w-full justify-center items-center">
              <Image src={info.header.product} alt={siteProduct} width={200} height={200} priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader2;
