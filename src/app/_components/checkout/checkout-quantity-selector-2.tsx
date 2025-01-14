import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { ProductInfoType } from "@/interfaces/productInfo";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { delay } from "@/app/_utils/delay";
import { PriceDisplaySimple } from "./checkout-price-display";
import DemandStrip from "./checkout-demand-strip";

type QuantityProps2 = {
  product: ProductInfoType;
  info: CheckoutPageType;
  setProduct: (product: ProductInfoType) => void;
  couponActive: boolean;
  country: string;
};

const QuantitySelector2 = ({ product, info, setProduct, couponActive, country }: QuantityProps2) => {
  const handleProductClick = (
    productNum: number,
    productPrice: number,
    productShipping: number,
    productShippingId: number,
    productOfferId: number,
    productStickyId: number,
  ) => {
    setProduct({
      product: productNum,
      productName: `${productNum + 1}x ${info.product.name}`,
      productPrice: productPrice.toString(),
      productShipping: productShipping.toString(),
      productShippingId: productShippingId.toString(),
      productOfferId: productOfferId.toString(),
      productStickyId: productStickyId.toString(),
    });
  };

  // For animating prices if a coupon activates
  const [price1, setPrice1] = useState(Number(info.product.price1));
  const [price2, setPrice2] = useState(Number(info.product.price2));
  const [price3, setPrice3] = useState(Number(info.product.price3));
  const [price4, setPrice4] = useState(Number(info.product.price4));

  useEffect(() => {
    const changePriceDrama = async () => {
      document.getElementById("price1")!.classList.add("bg-green-100");
      await delay(200);
      setPrice1(price1 - parseFloat(info.product.couponValue));
      document.getElementById("price1")!.classList.remove("bg-green-100");

      document.getElementById("price2")!.classList.add("bg-green-100");
      await delay(200);
      setPrice2(price2 - parseFloat(info.product.couponValue));
      document.getElementById("price2")!.classList.remove("bg-green-100");

      document.getElementById("price3")!.classList.add("bg-green-100");
      await delay(200);
      setPrice3(price3 - parseFloat(info.product.couponValue));
      document.getElementById("price3")!.classList.remove("bg-green-100");

      document.getElementById("price4")!.classList.add("bg-green-100");
      await delay(200);
      setPrice4(price4 - parseFloat(info.product.couponValue));
      document.getElementById("price4")!.classList.remove("bg-green-100");
    };
    if (couponActive) {
      changePriceDrama();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponActive]);

  return (
    <>
      {/* Heading row */}
      <div className="flex w-full justify-between items-center pb-4">
        <div className="flex w-full items-center">
          <Cog6ToothIcon className="h-5 w-5 mr-2" />
          <h3 className="font-bold text-base sm:text-lg">Step 1: Select Quantity</h3>
        </div>
      </div>

      {/* Demand strip directly under the heading */}
      <DemandStrip />

      {/* 1x & 2x Row */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
        {/* Buy 1x */}
        <div
          className={`border rounded-md p-3 w-full sm:w-1/2 cursor-pointer ${
            product.product === 0 ? "border-blue-400" : "border-gray-300"
          }`}
          onClick={() => {
            handleProductClick(
              0,
              Number(info.product.price1),
              Number(info.product.ship1),
              Number(info.product.shippingId1),
              Number(info.product.offerId1),
              Number(info.product.stickyId1),
            );
          }}
        >
          <div className="flex justify-between items-center">
            <Image src={info.product.image1} width={80} height={80} alt="1x" className="object-contain" />
            <div className="text-right">
              <p className="font-bold text-sm sm:text-base">1x</p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                <PriceDisplaySimple priceUSD={parseFloat(info.product.ogPrice1)} countryCode={country} digits={0} />
              </p>
              <p className="text-green-600 font-bold text-sm sm:text-base" id="price1">
                <PriceDisplaySimple priceUSD={price1} countryCode={country} digits={2} />
              </p>
            </div>
          </div>
        </div>

        {/* Buy 2x (Bestseller) */}
        <div
          className={`relative border rounded-md p-3 w-full sm:w-1/2 cursor-pointer ${
            product.product === 1 ? "border-blue-400" : "border-gray-300"
          }`}
          onClick={() => {
            handleProductClick(
              1,
              Number(info.product.price2),
              Number(info.product.ship2),
              Number(info.product.shippingId2),
              Number(info.product.offerId2),
              Number(info.product.stickyId2),
            );
          }}
        >
          <div className="absolute -left-6 top-4 transform -rotate-45 bg-blue-500 text-white text-xs font-bold px-3 py-1">
            Bestseller
          </div>
          <div className="flex justify-between items-center">
            <Image src={info.product.image2} width={80} height={80} alt="2x" className="object-contain" />
            <div className="text-right">
              <p className="font-bold text-sm sm:text-base">2x</p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                <PriceDisplaySimple priceUSD={parseFloat(info.product.ogPrice2)} countryCode={country} digits={0} />
              </p>
              <p className="text-green-600 font-bold text-sm sm:text-base" id="price2">
                <PriceDisplaySimple priceUSD={price2} countryCode={country} digits={2} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3x & 4x Row */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-3">
        {/* Buy 3x */}
        <div
          className={`border rounded-md p-3 w-full sm:w-1/2 cursor-pointer ${
            product.product === 2 ? "border-blue-400" : "border-gray-300"
          }`}
          onClick={() =>
            handleProductClick(
              2,
              Number(info.product.price3),
              Number(info.product.ship3),
              Number(info.product.shippingId3),
              Number(info.product.offerId3),
              Number(info.product.stickyId3),
            )
          }
        >
          <div className="flex justify-between items-center">
            <Image src={info.product.image3} width={80} height={80} alt="3x" className="object-contain" />
            <div className="text-right">
              <p className="font-bold text-sm sm:text-base">3x</p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                <PriceDisplaySimple priceUSD={parseFloat(info.product.ogPrice3)} countryCode={country} digits={0} />
              </p>
              <p className="text-green-600 font-bold text-sm sm:text-base" id="price3">
                <PriceDisplaySimple priceUSD={price3} countryCode={country} digits={2} />
              </p>
            </div>
          </div>
        </div>

        {/* Buy 4x */}
        <div
          className={`border rounded-md p-3 w-full sm:w-1/2 cursor-pointer ${
            product.product === 3 ? "border-blue-400" : "border-gray-300"
          }`}
          onClick={() =>
            handleProductClick(
              3,
              Number(info.product.price4),
              Number(info.product.ship4),
              Number(info.product.shippingId4),
              Number(info.product.offerId4),
              Number(info.product.stickyId4),
            )
          }
        >
          <div className="flex justify-between items-center">
            <Image src={info.product.image4} width={80} height={80} alt="4x" className="object-contain" />
            <div className="text-right">
              <p className="font-bold text-sm sm:text-base">4x</p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                <PriceDisplaySimple priceUSD={parseFloat(info.product.ogPrice4)} countryCode={country} digits={0} />
              </p>
              <p className="text-green-600 font-bold text-sm sm:text-base" id="price4">
                <PriceDisplaySimple priceUSD={price4} countryCode={country} digits={2} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuantitySelector2;
