import { useState } from "react";
import { useSelector } from "react-redux";
import Headphone from "../../assets/img/headphone.png";
import white_save from "../../assets/img/white_save.png";
import { useNavigate } from "react-router-dom";
import {
  useGetProductListQuery,
  useAddToCartMutation,
  useToggleWishlistMutation,
} from "../../redux/api/authApi";
import { toast } from "react-toastify";

const getDescriptionHtml = (description) =>
  description
    ? description.replace(/&nbsp;/g, " ")
    : "No description available.";

const ProductsSection = () => {
  const navigate = useNavigate();
  const searchTerm = useSelector((state) => state.product.searchTerm);
  const { data: productList, isLoading } = useGetProductListQuery();
  const [addToCart] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();
  const [showAll, setShowAll] = useState(false);
  const products = productList
    ? productList
        .filter((product) => product.is_published === true)
        .filter((product) =>
          product.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : [];
  console.log("Products", products);
  const displayedProducts = showAll ? products : products.slice(0, 8);

  const handleAddToCart = async (productId) => {
    try {
      const response = await addToCart({
        product_id: productId.toString(),
        quantity: 1,
      }).unwrap();

      navigate("/add-to-cart");
      toast.success(response.message || "Added to cart.");
    } catch (error) {
      // Check for 401 Unauthorized error
      if (
        error?.status === 401 ||
        error?.data?.detail === "Authentication credentials were not provided."
      ) {
        toast.error("Please login to add products to cart.");
        navigate("/login");
      } else {
        toast.error(error?.data?.message || "Something went wrong.");
      }
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const response = await toggleWishlist(productId).unwrap();
      toast.success(response.message || "Wishlist updated.");
      navigate("/wishlist");
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div
      id="products"
      className="py-16 px-4 sm:px-6 lg:px-8 xl:px-28 bg-white"
      // style={{
      //   backgroundColor: "#f3f4f6",
      //   backgroundImage: `
      //     radial-gradient(at 10% 20%, rgba(213, 181, 110, 0.08) 0px, transparent 40%),
      //     radial-gradient(at 90% 80%, rgba(213, 181, 110, 0.12) 0px, transparent 40%),
      //     linear-gradient(115deg, transparent 40%, rgba(213, 181, 110, 0.03) 44%, rgba(213, 181, 110, 0.08) 48%, rgba(213, 181, 110, 0.12) 50%, rgba(213, 181, 110, 0.08) 52%, rgba(213, 181, 110, 0.03) 56%, transparent 60%)
      //   `,
      // }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Check & Get Your Desired Product!
          </p>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-base text-blue-500 font-semibold hover:underline"
          >
            {showAll ? "See Less" : "See All"}
          </button>
        </div>
      </div>

      {/* No Products Message */}
      {products.length === 0 && !isLoading && (
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-900 mt-10 py-12">
            <p className="text-lg font-semibold">No products found.</p>
            <p className="text-gray-600 mt-2">Try searching with different keywords.</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id || index}
              className="  overflow-hidden  hover:shadow-md transition flex flex-col relative"
            >
              {/* Save Button */}
              <button
                onClick={() => handleToggleWishlist(product.id)}
                className="absolute  top-2 right-2 w-6 h-6 rounded-full shadow text-sm flex items-center justify-center"
              >
                <img src={white_save} alt="" />
              </button>

              {/* Image */}
              <img
                src={
                  product.image
                    ? `${product.image}`
                    : Headphone
                }
                alt={product.product_name}
                className="w-full h-52 object-contain p-4 cursor-pointer bg-gray-100 rounded-xl "
                onClick={() => navigate(`/products/${product.id}/detail`)}
              />

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                  {product.product_name}
                </h3>
                <div
                  className="text-sm text-gray-600 flex-grow line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: getDescriptionHtml(product?.description),
                  }}
                />
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
      )}
    </div>
  );
};

export default ProductsSection;
