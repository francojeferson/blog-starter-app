import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";

type CustomerInfoProps2 = {
  formik: any;
};

const CustomerInfo2 = ({ formik }: CustomerInfoProps2) => {
  const [formattedPhone, setFormattedPhone] = useState("");

  useEffect(() => {
    if (formik.values.phone) {
      setFormattedPhone(formatPhoneNumber(formik.values.phone));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    phone = phone.replace(/\D/g, "");

    if (phone.length === 10) {
      // Format as (XXX) XXX-XXXX for USA numbers
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    } else if (phone.length > 10) {
      // Format as +X (XXX) XXX-XXXX if the country code has 1 digit
      if (phone.length === 11) {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
      } else if (phone.length === 12) {
        // Format as +XX (XXX) XXX-XXXX if the country code has 2 digits
        return `+${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`;
      } else {
        // General formatting for longer international numbers
        return `+${phone.slice(0, phone.length - 10)} (${phone.slice(
          phone.length - 10,
          phone.length - 7,
        )}) ${phone.slice(phone.length - 7, phone.length - 4)}-${phone.slice(phone.length - 4)}`;
      }
    }
    return phone;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, "");

    // Set a maximum number of digits to 15
    if (cleanedValue.length <= 15) {
      formik.handleChange(e);
      setFormattedPhone(formatPhoneNumber(value));
    }
  };

  return (
    <>
      <div className="flex w-full justify-start items-center pb-6">
        <UserIcon className="h-5 w-5 mr-2" />
        <h3 className="font-bold text-base sm:text-lg">Step 3: Customer Information</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex w-full space-x-4">
          <div className="flex w-1/2 flex-col">
            <label className="font-bold text-sm pb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-sm"
              placeholder="First Name"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="flex w-1/2 flex-col">
            <label className="font-bold text-sm pb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-sm"
              placeholder="Last Name"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col mt-4">
          <label className="font-bold text-sm pb-2">Email Address</label>
          <input
            type="email"
            name="email"
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full border border-gray-400 px-3 py-2 rounded-md text-sm"
            placeholder="Email Address"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div className="flex w-full flex-col mt-4 mb-2">
          <label className="font-bold text-sm pb-2">Phone Number</label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            onBlur={formik.handleBlur}
            value={formattedPhone}
            className="w-full border border-gray-400 px-3 py-2 rounded-md text-sm"
            placeholder="Phone"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
          )}
        </div>
      </form>
    </>
  );
};

export default CustomerInfo2;
