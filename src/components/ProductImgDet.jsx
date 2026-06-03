import Headphone from "../assets/img/headphone.png";
import { useNavigate } from "react-router-dom";
import {
  useAddToCartMutation,
  useToggleWishlistMutation,
} from "../redux/api/authApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

export const ProductImgDet = ({ product, isLoading }) => {
  const navigate = useNavigate();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();
  const [selectedImage, setSelectedImage] = useState(Headphone);
 const descriptionHtml =
    product?.description?.replace(/&nbsp;/g, " ") ||
    "<p>No description available for this product.</p>";
  // Check if user is logged in
  const isAuthenticated = useSelector((state) => state.auth?.access);
  const productImages = useMemo(() => {
    if (!product) return [];

    const images = [
      product.image,
      ...(product.images || []).map((item) => item.image),
    ].filter(Boolean);

    return images.length > 0 ? images : [Headphone];
  }, [product]);

  useEffect(() => {
    setSelectedImage(productImages[0] || Headphone);
  }, [productImages]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error("Please login to add products to cart.");
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        product_id: product.id.toString(),
        quantity: 1,
      }).unwrap();
      toast.success("Added to cart!");
      navigate("/add-to-cart");
    } catch (error) {
      // Check for 401 Unauthorized error
      if (
        error?.status === 401 ||
        error?.data?.detail === "Authentication credentials were not provided."
      ) {
        toast.error("Please login to add products to cart.");
        navigate("/login");
      } else {
        toast.error(error?.data?.message || "Failed to add to cart");
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error("Please login to add products to wishlist.");
      navigate("/login");
      return;
    }

    try {
      const response = await toggleWishlist(product.id).unwrap();
      toast.success(response.message || "Wishlist updated.");
      navigate("/wishlist");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xl font-bold">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-xl font-bold">
        Product not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-14">
      {/* Product Images */}
      <div className="flex flex-col gap-5 w-full lg:w-1/2">
        <img
          src={selectedImage}
          alt={product.product_name}
          className="rounded-xl w-fit h-[300px] sm:h-[400px] object-contain bg-gray-100 p-6 border"
        />
        <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
          {productImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`w-16 h-16 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer border-2 bg-white ${
                selectedImage === image ? "border-[#D5B56E]" : "border-gray-200"
              }`}
            >
              <img
                src={image}
                alt={`${product.product_name} thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 w-full lg:w-1/2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
          {product.product_name}
        </h1>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm sm:text-base md:text-lg">
          <p className="text-black font-semibold ">
            Price: <span className=" text-[#D5B56E]">${product.price}</span>
          </p>
          <p className="text-black font-semibold ">
            Status:{" "}
            <span className=" text-[#D5B56E] capitalize">
              {product.stock_status?.replace("_", " ") || "In Stock"}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm sm:text-base md:text-lg">
          <p className="text-black font-semibold  text-left">
            Discount:{" "}
            <span className=" text-[#D5B56E]">{product.discount_percent}%</span>
          </p>
          <p className="text-black font-semibold  text-start">
            Quantity:{" "}
            <span className=" text-[#D5B56E]">{product.stock_quantity}</span>
          </p>
        </div>
        <p className="text-[#D5B56E] mt-2 text-sm">
          {"★".repeat(Math.round(product.rating || 0)) +
            "☆".repeat(5 - Math.round(product.rating || 0))}
          ({product.review_count || 0} reviews)
        </p>

        <h2 className="mt-4 font-bold">Description:</h2>
        <div
              className="text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:empty]:hidden [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:my-3 [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-3 [&_li]:pl-1 [&_li]:mb-1 [&_li]:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: descriptionHtml,
              }}
            />

        <div className="flex flex-col min-[420px]:flex-row w-full gap-3 mt-6 text-white">
          <button
            onClick={handleToggleWishlist}
            className="bg-[#FD5757] px-4 py-2.5 rounded-lg font-bold text-base w-full min-[420px]:w-1/3"
          >
            Add Wishlist
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-[#D5B56E] px-4 py-2.5 rounded-lg font-bold text-base w-full min-[420px]:w-1/3"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-[#0B1C3C] px-4 py-2.5 rounded-lg font-bold text-base w-full min-[420px]:w-1/3"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
