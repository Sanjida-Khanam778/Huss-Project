import React from "react";
import { CustomerSupportMain } from "../components/CustomerSupportMain";

export const CustomerSupport = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-3">
      {/* Breadcrumb */}
      <div className="text-left font-medium">
        <span className="text-gray-600 text-lg sm:text-xl">Home / </span>
        <span className="text-black font-bold text-lg sm:text-xl">Customer Support</span>
      </div>

      {/* Customer Support Main Section */}
      <CustomerSupportMain />
    </div>
  );
};
