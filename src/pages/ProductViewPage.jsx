import { useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useAddReviewMutation,
} from "../redux/api/authApi";
import { ProductImgDet } from "../components/ProductImgDet";
import ReviewImg from "../assets/img/review.png";
import { toast } from "react-toastify";

export default function ProductViewPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  const [showReviewBox, setShowReviewBox] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [formData, setFormData] = useState({
    review: "",
    photo: null, // file object
    rating: 0,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (formData.rating === 0) {
      toast.warn("Please select a rating.");
      return;
    }
    if (!formData.review.trim()) {
      toast.warn("Please provide your review message before submitting.");
      return;
    }

    const data = new FormData();
    data.append("rating", formData.rating.toString());
    data.append("comment", formData.review);
    if (formData.photo) {
      data.append("review_image", formData.photo);
    }

    try {
      const response = await addReview({ id, data }).unwrap();
      toast.success(response?.message || "Review submitted successfully!");

      setFormData({
        review: "",
        photo: null,
        rating: 0,
      });
      setShowReviewBox(false);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Oops! Error loading product.
          </h1>
          <p className="text-gray-600">
            {error?.data?.message || "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[#1c1c1c] px-4 sm:px-6 lg:px-8 xl:px-28 py-6">
      <ScrollRestoration />
      {/* Breadcrumb */}
      <div className="text-left font-medium pb-6 text-lg sm:text-xl">
        <span className="text-gray-600">
          {product?.category?.category_name || "Category"} /{" "}
        </span>
        <span className="text-black font-bold">{product?.product_name}</span>
      </div>
      {/* Left Main Section */}
      <div className="flex-1 justify-center w-full">
        <ProductImgDet product={product} isLoading={isLoading} />
        {/* Tabs */}
        <div className="mt-10 rounded-lg bg-white p-2 sm:p-3">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 sm:flex-none sm:w-48 h-12 rounded-lg font-bold text-sm sm:text-lg transition-colors ${
                activeTab === "description"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              Description
            </button>
             <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 sm:flex-none sm:w-48 h-12 rounded-lg font-bold text-sm sm:text-lg transition-colors ${
                activeTab === "specifications"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 sm:flex-none sm:w-48 h-12 rounded-lg font-bold text-sm sm:text-lg transition-colors ${
                activeTab === "reviews"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Specifications */}
        {activeTab === "specifications" && (
          <div className="mt-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h1 className="font-semibold text-lg sm:text-xl">
              Product Specifications
            </h1>
            <div className="flex flex-col md:flex-row gap-4 mt-4 w-full text-sm sm:text-base">
              <div className="flex flex-col w-full md:w-1/2">
                <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
                  <p>Material</p>
                  <p>Plastic</p>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
                  <p>Color</p>
                  <p>Navy</p>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
                  <p>Weight</p>
                  <p>4 KG</p>
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
                  <p>Warranty</p>
                  <p>2 Years Limited</p>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-300 mb-2">
                  <p>Country of Origin</p>
                  <p>Italy</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {activeTab === "description" && (
          <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h1 className="font-bold text-xl sm:text-2xl">Description</h1>
            <h3 className="font-semibold text-lg sm:text-xl my-2">
              {product?.product_name}
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {product?.description ||
                "No description available for this product."}
            </p>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h3 className="font-bold text-xl sm:text-2xl">Reviews</h3>
              <button
                className="bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white px-4 py-2 rounded-md text-sm font-medium self-start sm:self-center"
                onClick={() => setShowReviewBox(!showReviewBox)}
              >
                Write a Review
              </button>
            </div>
            <div className="text-gray-700 text-base sm:text-lg mt-2">
              Get specific details about this product from customers who own it.
            </div>
            <div className="flex flex-col justify-center items-center gap-3 mt-7 text-center">
              <img src={ReviewImg} alt="" />
              <p className="font-medium text-xl text-gray-700">
                This product has no reviews yet. Be the first one to write a
                review.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Sidebar */}
      {showReviewBox && (
        <div className="flex justify-center pt-6 lg:pt-5">
          <div className="w-full max-w-lg p-4 rounded-lg shadow-md h-fit">
            <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

            <p className="font-medium text-base pb-1">Your Review</p>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="w-full border p-2 rounded-md h-24"
              required
            />

            {/* <p className="font-medium text-base pb-1">Product Image</p> */}
            <div className="mt-4">
              <label className="block text-base font-bold text-gray-700 mb-2">
                Product Image
              </label>

              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleChange}
                className="hidden"
                required
              />

              <div className="flex w-full">
                {/* Custom styled label */}
                <label
                  htmlFor="photo"
                  className="flex items-center px-4 py-2 text-white bg-gray-500 rounded-l-xl cursor-pointer text-sm font-medium whitespace-nowrap"
                >
                  Choose File
                </label>

                {/* File name display */}
                <div className="flex items-center px-4 py-2 text-gray-600 text-sm font-normal w-full shadow bg-white rounded-r-xl border border-gray-300">
                  {formData.photo ? `${formData.photo.name}` : "No File Chosen"}
                </div>
              </div>
            </div>
            <div className="reviegap-2 my-3">
              <p className="font-medium text-base">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className="flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`text-2xl pb-1 ${
                        star <= formData.rating
                          ? "text-[#D5B56E]"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className={`text-white w-full py-2 rounded-md font-semibold transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#D5B56E] hover:bg-[#D5B56E]/90"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
