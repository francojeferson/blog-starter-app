import React from "react";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import Image from "next/image";
import { siteProduct } from "@/lib/site-info";

type Props = {
  info: CheckoutPageType;
};
const CheckoutHeader = ({ info }: Props) => {
  return (
    <div className="flex w-full relative flex-col items-center">
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
            <div className="hidden lg:flex w-1/2 justify-start items-center">
              <Image
                src={info.header.product}
                alt={siteProduct}
                width={300}
                height={300}
                priority
              />
            </div>
            <div className="flex w-full lg:w-1/2 lg:justify-end justify-center items-center space-x-2 lg:space-x-0 ">
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
            <div className="flex lg:hidden w-full justify-center items-center">
              <Image
                src={info.header.product}
                alt={siteProduct}
                width={200}
                height={200}
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center bg-gradient-to-r from-[#53a1ea] to-[#365bf2]">
        <div className="flex w-full max-w-[1100px] justify-between items-center px-4 text-[12px] sm:text-[16px]">
          <div className="flex w-1/2 lg:w-1/3 p-2 sm:p-4 justify-center items-center font-bold text-white">
            <Image
              src={info.blurbs.icon1}
              alt={info.blurbs.text1}
              width={40}
              height={40}
              className="max-w-[25px] sm:max-w-none mr-4"
            />
            {info.blurbs.text1}
          </div>
          <div className="hidden lg:flex w-1/3 p-4 justify-center items-center font-bold text-white">
            <Image
              src={info.blurbs.icon2}
              alt={info.blurbs.text2}
              width={40}
              height={40}
              className="mr-4"
            />
            {info.blurbs.text2}
          </div>
          <div className="flex w-1/2 lg:w-1/3 p-2 sm:p-4 justify-center items-center font-bold text-white">
            <Image
              src={info.blurbs.icon3}
              alt={info.blurbs.text3}
              width={40}
              height={40}
              className=" max-w-[25px] sm:max-w-none mr-4"
            />
            {info.blurbs.text3}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
