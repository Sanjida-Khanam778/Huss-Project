import { CheckoutOrderItems } from "../CheckoutPageComonents/CheckoutOrderItems";
import van from "../../assets/img/van.png";
import smallCpu from "../../assets/img/small-cpu.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSuccessOrderQuery } from "../../redux/api/authApi";

export const TrackOrderSummary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_uuid");

  const { data, isLoading, isError } = useSuccessOrderQuery(orderId, {
    skip: !orderId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading order summary.</div>;

  const orderDetails = data?.order_details;
  const items = orderDetails?.items || [];
  const summary = orderDetails?.summary;

  const handleContactSupport = (e) => {
    e.preventDefault();
    navigate("/customer-support");
  };

  return (
    <form
      onSubmit={handleContactSupport}
      className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-xl"
    >
      <h1 className="font-semibold text-xl sm:text-2xl">Order Summary</h1>
      {items.map((item, index) => (
        <CheckoutOrderItems
          key={index}
          product={{
            title: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: smallCpu, // Assuming smallCpu as placeholder or if API provides image, use it
            shop: "N/A", // API doesn't seem to provide shop name per item
          }}
        />
      ))}
      <div className="border-b border-gray-300"></div>

      <div className="flex justify-between font-normal text-base sm:text-lg md:text-xl">
        <p>Subtotal ({items.length} items)</p>
        <p>${summary?.subtotal?.toFixed(2) || "0.00"}</p>
      </div>
      <div className="flex justify-between font-normal text-base sm:text-lg md:text-xl">
        <p>Delivery fee</p>
        <p>${summary?.delivery_fee?.toFixed(2) || "0.00"}</p>
      </div>
      <div className="flex justify-between font-normal text-base sm:text-lg md:text-xl">
        <p>Tax</p>
        <p>${summary?.tax?.toFixed(2) || "0.00"}</p>
      </div>
      <div className="flex justify-between font-normal text-base sm:text-lg md:text-xl text-green-600">
        <p>Total Discount</p>
        <p>-${summary?.total_discount?.toFixed(2) || "0.00"}</p>
      </div>
      <div className="border-b border-gray-300"></div>
      <div className="flex justify-between">
        <p className="font-semibold text-xl sm:text-2xl">Total</p>
        <p className="font-semibold text-2xl sm:text-3xl text-[#D5B56E]">
          ${summary?.total_amount?.toFixed(2) || "0.00"}
        </p>
      </div>

      <div className="w-full p-4 rounded-xl">
        <div className="mb-2 flex items-center gap-2">
          <img src={van} alt="" />
          <h1 className="font-medium text-sm">Delivery Info</h1>
        </div>
        <div className="font-normal text-xs text-gray-600 flex flex-col justify-start">
          <p>Order: {orderDetails?.order_number || "N/A"}</p>
          <p>Expected: {orderDetails?.estimated_delivery || "N/A"}</p>
          <p>Carrier: XYZ</p>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center rounded-lg py-1.5 bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white text-lg md:text-xl font-bold shadow"
      >
        Contact Support
      </button>
    </form>
  );
};
