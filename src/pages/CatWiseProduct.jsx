import { useState } from "react";
import DOMPurify from "dompurify";
import left from "../assets/img/left-angle.png";
import right from "../assets/img/right-angle.png";
import { ScrollRestoration, useNavigate, useParams } from "react-router-dom";
import { useGetProductListQuery } from "../redux/api/authApi";

const CatWiseProduct = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch products filtered by category
  const {
    data: productList,
    isLoading,
    isError,
  } = useGetProductListQuery(categoryName);

  // Filter only published products
  const products = productList
    ? productList.filter((product) => product.is_published === true)
    : [];

  console.log("Products", products);

  // Calculate pagination
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products?.slice(startIndex, endIndex) || [];

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page area, and last page with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get base URL for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // If the path already includes the base URL, return as is
    if (imagePath.startsWith("http")) return imagePath;
    // Otherwise, prepend the base URL (remove /api/v1 from base URL for media files)
    return `${import.meta.env.VITE_BASE_URL_MEDIA}${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 xl:px-28 min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 xl:px-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-red-600 mb-4">
            Failed to load products
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white px-6 py-2 rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 xl:px-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium mb-4">
            No products found in this category
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white px-6 py-2 rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 xl:px-28 min-h-screen">
      <ScrollRestoration />

      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="bg-black w-full text-white flex justify-between py-2.5 px-4 mb-4 items-center rounded-t-xl">
          <h1 className="text-base font-semibold">
            {decodeURIComponent(categoryName)} ({totalProducts} Products)
          </h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <img
                src={product.images[0].image}
                alt={product.product_name}
                className="h-48 w-full object-contain bg-gray-50 rounded-t-lg mb-4 cursor-pointer"
                onClick={() => navigate(`/products/${product.id}/detail`)}
              />

              {/* Product Name */}
              <h2 className="text-lg font-semibold mb-2 px-4 line-clamp-2">
                {product.product_name}
              </h2>

              {/* Product Description */}
              {product.description && (
                <div
                  className="text-sm text-gray-600 mb-4 px-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                />
              )}

              {/* Stock Status */}
              <div className="px-4 mb-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    product.stock_status === "in_stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock_status === "in_stock"
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Price and Actions */}
              <div className="flex justify-between items-center p-4">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#D5B56E]">
                    ${product.discounted_price}
                  </span>
                  {product.discount_percent > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/products/${product.id}/detail`)}
                  className="bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white px-4 py-2 rounded font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Only show if more than 12 products */}
        {totalPages > 1 && (
          <div className="w-full py-1.5 mt-6 rounded-lg flex flex-wrap gap-2 justify-center lg:justify-end">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <img src={left} alt="Previous" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <div className="px-2 flex items-center">...</div>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`p-2 rounded w-8 h-8 flex justify-center items-center ${
                      currentPage === page
                        ? "bg-[#D5B56E] text-white shadow"
                        : "border border-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <img src={right} alt="Next" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatWiseProduct;
