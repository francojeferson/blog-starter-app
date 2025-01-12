import React from "react";
import Image from "next/image";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { siteProduct } from "@/lib/site-info";
import { PriceDisplaySimple } from "./checkout-price-display";

type DiscountProps = {
  product: number;
  info: CheckoutPageType;
  couponActive: boolean;
  country: string;
};

//shows the current discount off of full pricer
const DiscountBar = ({
  product,
  info,
  couponActive,
  country,
}: DiscountProps) => {
  const discountDetails = [
    {
      src: "https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/3fea0d9a-2395-48e0-bd69-6a3ed0e4a100/public",
      alt: "50% Discount Badge",
      text: "Your 50% Discount Has Been Applied",
      percent: "50%",
      oldPrice: info.product.ogPrice1,
      newPrice: info.product.price1,
    },
    {
      src: "https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/f3b86681-3446-4bd8-db4a-1e99050a5300/public",
      alt: "56% Discount Badge",
      text: "Your 56% Discount Has Been Applied",
      percent: "56%",
      oldPrice: info.product.ogPrice2,
      newPrice: info.product.price2,
    },
    {
      src: "https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/9d753d3d-eb6d-439c-4168-fc13fb261600/public",
      alt: "58% Discount Badge",
      text: "Your 58% Discount Has Been Applied",
      percent: "58%",
      oldPrice: info.product.ogPrice3,
      newPrice: info.product.price3,
    },
    {
      src: "https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/54294b32-6664-4698-9756-5b0091956c00/public",
      alt: "60% Discount Badge",
      text: "Your 60% Discount Has Been Applied",
      percent: "60%",
      oldPrice: info.product.ogPrice4,
      newPrice: info.product.price4,
    },
  ];

  const currentDiscount = discountDetails[product];
  const currentPrice =
    Number(currentDiscount.newPrice) - (couponActive ? 5 : 0);

  return (
    <div className="flex w-full items-center">
      <Image
        src={currentDiscount.src}
        width={70}
        height={70}
        alt={currentDiscount.alt}
        className="object-scale-down w-1/3 max-w-[70px] sm:w-auto"
      />
      <div className="flex flex-col flex1 pl-4">
        <p className="text-[#d91616] text-[17px] sm:text-[20px] font-bold">
          Your {currentDiscount.percent} Discount{" "}
          {(couponActive && (
            <>
              {" "}
              <span className="text-blue-600 underline">
                & ${info.product.couponValue} Off Coupon
              </span>{" "}
              Have Been Applied
            </>
          )) || <>Has Been Applied </>}{" "}
        </p>
        <p className="text-[14px] font-bold">
          {siteProduct} is available at the price of{" "}
          <span className="line-through">
            <PriceDisplaySimple
              priceUSD={Number(currentDiscount.oldPrice)}
              countryCode={country}
              digits={0}
            />
            {/* {currentDiscount.oldPrice} */}
          </span>{" "}
          <span className="text-[#27ae60]">
            <PriceDisplaySimple
              priceUSD={currentPrice}
              countryCode={country}
              digits={2}
            />
            {/* ${currentPrice.toFixed(2)} */}
          </span>{" "}
          ({currentDiscount.percent} Discount Per Unit)
        </p>
      </div>
    </div>
  );
};

export default DiscountBar;
