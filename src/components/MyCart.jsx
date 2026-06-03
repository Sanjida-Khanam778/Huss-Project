import { OrderSection } from "./OrderSection";
import { CartItem } from "./CartItem";
import { CartSuggetion } from "./CartSuggetion";
import { useGetCartQuery } from "../redux/api/authApi";
import { ScrollRestoration } from "react-router-dom";

export const MyCart = () => {
  const { data, isLoading } = useGetCartQuery();
  const cartDetails = data?.cart_details || [];
  const orderSummary = data?.order_summary;

  if (isLoading) {
    return <div className="py-20 text-center text-2xl">Loading cart...</div>;
  }

  return (
    <div className="py-16">
      <ScrollRestoration />
      {/* Header */}
      <div className="text-start mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          My Cart
        </h2>
        <p className="text-gray-600">
          Review your selected items before checkout
        </p>
      </div>

      {/* Cart Product Section */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="w-full lg:w-2/3 flex flex-col gap-5">
          {cartDetails.length > 0 ? (
            cartDetails.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <div className="bg-white rounded-lg p-10 text-center shadow">
              <p className="text-xl font-medium text-gray-500">
                Your cart is empty.
              </p>
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg p-4 shadow">
          <OrderSection summary={orderSummary} />
        </div>
      </div>

      {/* Product Suggestion */}
      <div className="pt-16">
        <CartSuggetion />
      </div>
    </div>
  );
};
