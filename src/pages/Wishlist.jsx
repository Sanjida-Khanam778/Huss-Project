import React from "react";
import MyWishlist from "../components/MyWishlist";

export const Wishlist = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-3 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-left font-medium">
        <span className="text-gray-600 text-lg sm:text-xl">Account / </span>
        <span className="text-black font-bold text-lg sm:text-xl">Wishlist</span>
      </div>
      {/* My wishlist */}
      <MyWishlist />
    </div>
  );
};
