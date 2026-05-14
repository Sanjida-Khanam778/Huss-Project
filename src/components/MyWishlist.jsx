import React, { useState } from "react";
import delete_wishlist from "../assets/img/delete.png";
import left from "../assets/img/left-angle.png";
import right from "../assets/img/right-angle.png";
import { useNavigate } from "react-router-dom";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useAddToCartMutation,
} from "../redux/api/authApi";
import { toast } from "react-toastify";

const MyWishlist = () => {
  const navigate = useNavigate();
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = wishlist.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (productId) => {
    try {
      const response = await toggleWishlist(productId).unwrap();
      toast.success(response.message || "Removed from wishlist");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove item");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        product_id: productId.toString(),
        quantity: 1,
      }).unwrap();
      toast.success("Added to cart!");
      navigate("/add-to-cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xl font-bold">
        Loading Wishlist...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-[#D5B56E] text-white px-6 py-2 rounded-lg font-bold"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="py-16">
      {/* Header */}
      <div className="text-start mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          My Wishlist
        </h2>
        <p className="text-gray-600">Your saved favorites, all in one place.</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col relative"
          >
            {/* Close Button */}
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full shadow text-sm flex items-center justify-center bg-white z-10"
            >
              <img src={delete_wishlist} alt="delete" className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={
                product.image
                  ? `${import.meta.env.VITE_BASE_URL_MEDIA}${product.image}`
                  : ""
              }
              alt={product.product_name}
              className="w-full h-52 object-contain  cursor-pointer  bg-gray-100 p-6 rounded-md overflow-hidden "
              onClick={() => navigate(`/products/${product.id}/detail`)}
            />

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
                {product.product_name}
              </h3>
              <p className="text-sm text-gray-600 flex-grow line-clamp-2">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  ${product.price}
                </span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-[#D5B56E] text-white px-4 py-1 rounded hover:bg-[#D5B56E]/90 transition text-sm font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full mt-8 flex flex-wrap gap-2 justify-center sm:justify-end">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center hover:bg-gray-100 disabled:opacity-50"
          >
            <img src={left} alt="left arrow" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`p-2 rounded w-8 h-8 flex justify-center items-center ${
                currentPage === i + 1
                  ? "bg-[#D5B56E] text-white"
                  : "border border-gray-400 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center hover:bg-gray-100 disabled:opacity-50"
          >
            <img src={right} alt="right arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
