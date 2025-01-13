import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { GlobeAmericasIcon, LockClosedIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { CheckoutPageType } from "@/interfaces/checkoutPage";
import { ProductInfoType } from "@/interfaces/productInfo";
import StateProvinceSelect from "./checkout-state-selector";
import { PriceDisplaySimple } from "./checkout-price-display";

type PaymentProps2 = {
  info: CheckoutPageType;
  product: ProductInfoType;
  formik: any;
  loading: string;
  firePaypal: () => void;
  country: string;
  setCountry: (country: string) => void;
};

const PaymentOptions2 = ({ info, product, formik, loading, firePaypal, country, setCountry }: PaymentProps2) => {
  const addressInputRef = useRef(null);

  useEffect(() => {
    if (addressInputRef.current) {
      const { google } = window as any;
      if (!google?.maps?.places) return; // If no Google available, skip
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
          const addressObj: Record<string, string> = {};
          for (const comp of place.address_components) {
            const types = comp.types;
            if (types.includes("street_number")) {
              addressObj.street_number = comp.long_name;
            }
            if (types.includes("route")) {
              addressObj.route = comp.long_name;
            }
            if (types.includes("subpremise")) {
              addressObj.subpremise = comp.long_name;
            }
            if (types.includes("locality")) {
              addressObj.city = comp.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              addressObj.state = comp.short_name;
            }
            if (types.includes("postal_code")) {
              addressObj.zip = comp.long_name;
            }
            if (types.includes("country")) {
              addressObj.country = comp.short_name;
            }
          }

          const mainAddress = [addressObj.street_number, addressObj.route].filter(Boolean).join(" ");

          formik.setFieldValue("address", mainAddress || "");
          formik.setFieldValue("address2", addressObj.subpremise || "");
          formik.setFieldValue("city", addressObj.city || "");
          formik.setFieldValue("state", addressObj.state || "");
          formik.setFieldValue("zip", addressObj.zip || "");
          formik.setFieldValue("country", addressObj.country || "");
          setCountry(addressObj.country || "");
        }
      });
    }
  }, [formik, setCountry]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.handleChange(e);
    setCountry(e.target.value);
  };

  return (
    <>
      {/* If loading, display a small overlay */}
      {loading && (
        <div className="fixed h-screen w-screen top-0 left-0 z-40 flex justify-center items-center bg-black/20">
          <div className="bg-blue-600 text-white p-4 rounded-md flex flex-col items-center w-[280px]">
            <div className="mb-2 text-lg font-bold">{loading}</div>
            <div className="h-8 w-8 border-4 border-white border-t-transparent animate-spin rounded-full" />
          </div>
        </div>
      )}

      {/* Payment steps */}
      <div className="hidden lg:flex items-center space-x-2 pb-4">
        <GlobeAmericasIcon className="h-4 w-4" />
        <h3 className="font-bold text-base">Step 3: Payment Options</h3>
      </div>

      {/* Also could display CC vs PayPal radio for full desktop */}
      <div className="hidden lg:flex items-center mb-4 space-x-4">
        {/* Credit Card Option */}
        <label className="cursor-pointer flex items-center space-x-2">
          <input type="radio" checked readOnly />
          <div className="flex border border-green-500 rounded px-2 py-1 items-center space-x-2">
            <Image
              src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/60ac8520-9b26-4b76-8cf0-4d4fd5d52800/public"
              width={50}
              height={20}
              alt="Visa"
              className="object-scale-down"
            />

            <Image
              src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/e95314d5-1adc-477b-1631-38162b91ad00/public"
              width={50}
              height={20}
              alt="Mastercard"
              className="object-scale-down border-x border-gray-300 px-2"
            />

            <Image
              src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/5e7d79a8-f00e-4ea8-7aac-3484c20e7e00/public"
              width={50}
              height={20}
              alt="American Express"
              className="object-scale-down"
            />
          </div>
        </label>

        {/* PayPal Option */}
        <label className="cursor-pointer flex items-center space-x-2">
          <input
            type="radio"
            checked={false}
            onChange={() => {
              if (loading === "") {
                firePaypal();
              }
            }}
          />
          <div className="flex border-2 border-yellow-400 bg-yellow-400 rounded px-2 py-1 hover:bg-yellow-300">
            <Image
              src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/1397951e-7288-4b95-8ef1-b1f423b56c00/public"
              width={80}
              height={20}
              alt="Paypal"
              className="object-scale-down "
            />
          </div>
        </label>
      </div>

      {/* Divider */}
      <div className="hidden lg:block h-px bg-gray-200 mb-4" />

      <div className="flex items-center space-x-2 pb-2">
        <LockClosedIcon className="h-4 w-4" />
        <h3 className="font-bold text-base">Step 4: Delivery Address</h3>
      </div>

      {/* Country Selection */}
      <div className="mb-4">
        <label className="block font-bold text-sm mb-1">Country</label>
        <div className="relative">
          <select
            name="country"
            onChange={handleCountryChange}
            value={formik.values.country}
            className="border border-gray-400 rounded w-full py-2 px-3 pr-8"
          >
            <option value="US">United States</option>
            <option value="AU">Australia</option>
            <option value="CA">Canada</option>
            <option value="FI">Finland</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="IS">Iceland</option>
            <option value="IE">Ireland</option>
            <option value="IL">Israel</option>
            <option value="NZ">New Zealand</option>
            <option value="NO">Norway</option>
            <option value="SE">Sweden</option>
            <option value="GB">United Kingdom</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-600 absolute right-2 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Address Fields */}
      <div className="mb-4">
        <label className="block font-bold text-sm mb-1">Delivery Address</label>
        <input
          type="text"
          name="address"
          ref={addressInputRef}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          className="border border-gray-400 rounded w-full py-2 px-3 mb-2"
          placeholder="Street Address"
        />
        <input
          type="text"
          name="address2"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.address2}
          className="border border-gray-400 rounded w-full py-2 px-3"
          placeholder="Apartment, suite, etc. (optional)"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold text-sm mb-1">City</label>
        <input
          type="text"
          name="city"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.city}
          className="border border-gray-400 rounded w-full py-2 px-3"
          placeholder="City"
        />
      </div>

      {/* State + Zip row */}
      <div className="flex space-x-3 mb-4">
        <div className="flex-1">
          <StateProvinceSelect formik={formik} country={country} />
        </div>
        <div className="flex-1">
          <label className="block font-bold text-sm mb-1">{country === "US" ? "Zip Code" : "Postal Code"}</label>
          <input
            type="text"
            name="zip"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.zip}
            className="border border-gray-400 rounded w-full py-2 px-3"
            placeholder={country === "US" ? "Zip Code" : "Postal Code"}
          />
        </div>
      </div>

      {/* Shipping Radio */}
      <div className="mb-4">
        <label className="block font-bold text-sm mb-1">Shipping</label>
        <label className="flex items-center space-x-2 mt-1">
          <input type="radio" name="shipping" defaultChecked value={"1"} className="cursor-pointer" />
          <span className="text-sm">
            Standard{" "}
            <PriceDisplaySimple priceUSD={parseFloat(product.productShipping)} countryCode={country} digits={2} />
          </span>
        </label>
      </div>

      {/* Card Input */}
      <div className="mb-4">
        <label className="block font-bold text-sm mb-1">Card Number</label>
        <input
          type="text"
          name="card"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.card}
          maxLength={16}
          pattern="\d*"
          className="border border-gray-400 rounded w-full py-2 px-3"
          placeholder="Credit Card Number"
        />
        <p className="text-xs text-gray-500 mt-1">We do not accept American Express</p>
      </div>

      {/* Month + Year row */}
      <div className="flex space-x-3 mb-4">
        <div className="flex-1">
          <label className="block font-bold text-sm mb-1">Expiry Month</label>
          <div className="relative">
            <select
              name="month"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.month}
              className="border border-gray-400 rounded w-full py-2 px-3 pr-8"
            >
              <option disabled value="">
                Month
              </option>
              <option value="1">(01) January</option>
              <option value="2">(02) February</option>
              <option value="3">(03) March</option>
              <option value="4">(04) April</option>
              <option value="5">(05) May</option>
              <option value="6">(06) June</option>
              <option value="7">(07) July</option>
              <option value="8">(08) August</option>
              <option value="9">(09) September</option>
              <option value="10">(10) October</option>
              <option value="11">(11) November</option>
              <option value="12">(12) December</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-600 absolute top-2 right-2 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-bold text-sm mb-1">Expiry Year</label>
          <div className="relative">
            <select
              name="year"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.year}
              className="border border-gray-400 rounded w-full py-2 px-3 pr-8"
            >
              <option disabled value="">
                Year
              </option>
              {Array.from({ length: 22 }, (_, i) => 2024 + i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-600 absolute top-2 right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* CVV */}
      <div className="mb-6">
        <label className="block font-bold text-sm mb-1">CVV</label>
        <input
          type="text"
          name="cvv"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cvv}
          maxLength={4}
          pattern="\d*"
          className="border border-gray-400 rounded w-full py-2 px-3"
          placeholder="CVV"
        />
      </div>

      {/* Terms & Final Submit */}
      <p className="text-xs text-gray-500 mb-4">
        By placing this order, you agree to {info.product.name}{" "}
        <a href="/terms-conditions" className="text-blue-600 underline" tabIndex={1}>
          terms and conditions
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-blue-600 underline" tabIndex={2}>
          privacy policy
        </a>
        .
      </p>
      <input
        type="submit"
        value={info.buttonCta}
        className="bg-green-600 text-white font-bold text-lg w-full py-3 rounded hover:bg-green-700 cursor-pointer"
      />

      {/* SSL + Secure Payment Footer */}
      <div className="mt-6 border-t pt-4 text-center">
        <Image
          src="https://imagedelivery.net/3TTaU3w9z1kOYYtN3czCnw/8ff78d00-d526-4377-2537-257830592600/public"
          width={400}
          height={37}
          alt="Secure Checkout"
          className="mx-auto mb-2"
        />
      </div>
      <div className="flex justify-center items-center space-x-2 text-sm">
        <LockClosedIcon className="h-4 w-4 text-green-700" />
        <p className="uppercase text-green-700 font-bold">SSL Secured Payment</p>
      </div>
      <p className="text-xs text-gray-500 text-center">Your information is protected by 256-bit SSL encryption.</p>
    </>
  );
};

export default PaymentOptions2;
