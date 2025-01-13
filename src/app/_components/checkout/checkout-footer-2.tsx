import Link from "next/link";
import Image from "next/image";
import { siteProduct } from "@/lib/site-info";
import { Raleway } from "next/font/google";
import { CheckoutPageType } from "@/interfaces/checkoutPage";

const raleway = Raleway({ subsets: ["latin"] });

type Props2 = {
  info: CheckoutPageType;
};

const CheckoutFooter2 = ({ info }: Props2) => {
  return (
    <footer className="flex flex-col w-full">
      {/* Main Footer Wrapper */}
      <div className={`bg-blue-100 flex flex-col items-center py-12 ${raleway.className}`}>
        {/* Logo */}
        <Image
          src={info.logo}
          width={160}
          height={160}
          alt={siteProduct}
          className="mb-6 hover:opacity-75 cursor-pointer"
        />

        {/* Links Row */}
        <div className="flex flex-col md:flex-row w-full max-w-[1024px] justify-center items-center font-bold">
          <div className="flex border-b-[1px] border-[#aaa] pb-6 px-4 text-center flex-col md:flex-row">
            <div className="px-4 mb-2 text-[16px] text-[#333] hover:opacity-75 cursor-pointer">
              <Link href="/contact-us" target="_blank">
                Contact Us
              </Link>
            </div>
            <div className="px-4 mb-2 text-[16px] text-[#333] hover:opacity-75 cursor-pointer">
              <Link href="/terms-conditions" target="_blank">
                Terms of Service
              </Link>
            </div>
            <div className="px-4 mb-2 text-[16px] text-[#333] hover:opacity-75 cursor-pointer">
              <Link href="/privacy-policy" target="_blank">
                Privacy Policy
              </Link>
            </div>
            <div className="px-4 mb-2 text-[16px] text-[#333] hover:opacity-75 cursor-pointer">
              <Link href="/shipping-returns" target="_blank">
                Shipping & Returns
              </Link>
            </div>
            <div className="px-4 mb-2 text-[16px] text-[#333] hover:opacity-75 cursor-pointer">
              <Link href="/mobile-terms-conditions" target="_blank">
                Mobile Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-center mt-6 mb-12 font-bold text-[16px] text-center">
          <p>© 2025 {siteProduct}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CheckoutFooter2;
