import { ReturnMain } from "../components/ReturnPageComponent/ReturnMain";

export const Return = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-3">
      {/* Breadcrumb */}
      <div className="text-left font-medium">
        <span className="text-gray-600 text-lg sm:text-xl">Home / </span>
        <span className="text-black font-bold text-lg sm:text-xl">Return & Return Policy</span>
      </div>

      {/* Return Main Section */}
      <ReturnMain />
    </div>
  );
};
