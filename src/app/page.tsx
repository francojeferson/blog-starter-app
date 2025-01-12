import React from "react";
import CheckoutPage from "../app/_components/checkout-page";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import { getCheckoutBySlug } from "@/app/_utils/api";
// import { baseCheckout } from "@/lib/site-info";

const baseCheckout = "splash-foam-checkout";

const montserrat = Montserrat({ subsets: ["latin"] });

export function generateMetadata(): Metadata {
  const info = getCheckoutBySlug(baseCheckout);

  return {
    title: info.metaTitle,
    description: info.metaDescription,
  };
}

const Page = () => {
  const checkoutInfo = getCheckoutBySlug(baseCheckout);

  return (
    <div className={montserrat.className}>
      <CheckoutPage info={checkoutInfo} />
    </div>
  );
};

export default Page;
