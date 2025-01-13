import React from "react";
import CheckoutHeader from "./checkout/checkout-header";
import CheckoutForm from "./checkout/checkout-form";
import Footer from "./checkout/checkout-footer";
import CheckoutHeader2 from "./checkout/checkout-header-2";
import CheckoutForm2 from "./checkout/checkout-form-2";
import CheckoutFooter2 from "./checkout/checkout-footer-2";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import FunnelFluxScripts from "@/lib/funnel-flux-scripts";
import CheckoutClickId from "./checkout/checkout-click-id";

type Props = {
  info: CheckoutPageType;
};

const CheckoutPage = ({ info }: Props) => {
  if (!info) {
    return <div>Error: Unable to load checkout information. Please try again later.</div>;
  }

  return (
    <>
      {/* Template 1 */}
      {info.template === "1" && (
        <div className="flex flex-col items-center relative">
          <CheckoutHeader info={info} />
          <CheckoutForm info={info} />
          <Footer info={info} />
          <FunnelFluxScripts funnelFlux={info.funnelFlux} />
          <CheckoutClickId />
        </div>
      )}

      {/* Template 2 */}
      {info.template === "2" && (
        <div className="flex flex-col items-center relative">
          {/* Build this Page following the same patterns as Template1 */}
          <CheckoutHeader2 info={info} />
          <CheckoutForm2 info={info} />
          <CheckoutFooter2 info={info} />
          <FunnelFluxScripts funnelFlux={info.funnelFlux} />
          <CheckoutClickId />
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
