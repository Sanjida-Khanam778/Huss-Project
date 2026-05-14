import React from "react";
import { MyCart } from "../components/MyCart";

export const AddToCart = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-3">
      {/* Breadcrumb */}
      <div className="text-left font-medium">
        <span className="text-gray-600 text-lg sm:text-xl">Home / </span>
        <span className="text-black font-bold text-lg sm:text-xl">Add to Cart</span>
      </div>
      {/* My Cart */}
      <MyCart />
    </div>
  );
};
