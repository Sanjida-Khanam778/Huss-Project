import { OrderPlaced } from "../components/ConfirmPageComponent/OrderPlaced";

export const ConfirmOrder = () => {
  return (
    <div className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:px-12 lg:py-8 xl:px-28 2xl:px-32">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-x-2 text-left font-medium text-base sm:text-lg lg:text-xl">
        <span className="text-gray-600 whitespace-nowrap">Home /</span>
        <span className="text-black font-bold whitespace-nowrap">
          Add to Cart /
        </span>
        <span className="text-black font-bold whitespace-nowrap">
          Checkout /
        </span>
        <span className="text-black font-bold whitespace-nowrap">
          Confirm Order
        </span>
      </div>

       <OrderPlaced />
    </div>
  );
};
