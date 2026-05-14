import React, { useState } from "react";
import { useGetMyOrdersQuery } from "../../redux/api/authApi";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import left from "../../assets/img/left-angle.png";
import right from "../../assets/img/right-angle.png";
import { MoreVertical, Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

export const MyOrders = () => {
  const navigate = useNavigate();
  const { data: myOrders, isLoading } = useGetMyOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalItems = myOrders?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = myOrders?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-bold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-28 py-3 min-h-screen">
      <ScrollRestoration />
      {/* Breadcrumb */}
      <div className="text-left font-medium mb-6">
        <span className="text-gray-600 text-lg sm:text-xl">Home / </span>
        <span className="text-black font-bold text-lg sm:text-xl">
          My Orders
        </span>
      </div>

      <div className="w-full">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            My Orders
          </h2>

          {!myOrders || myOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">
              You have no orders yet.
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#f8f5ee] border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800">
                          {order.order_id}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Items:
                        </p>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {order.products.map((product, idx) => (
                            <li key={idx} className="truncate max-w-xs">
                              {product.product_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className="relative"
                      ref={openMenuId === order.id ? menuRef : null}
                    >
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === order.id ? null : order.id,
                          )
                        }
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>

                      {openMenuId === order.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={() => {
                              navigate(
                                `/add-to-cart/checkout/confirm-order?order_uuid=${order.order_uuid}`,
                              );
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors border-b border-gray-100"
                          >
                            <Eye size={16} className="text-[#D5B56E]" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/return-policy?id=${order.id}`);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                          >
                            <RotateCcw size={16} className="text-red-600" />
                            Return Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="w-full py-1.5 mt-8 rounded-lg flex flex-wrap gap-2 justify-center lg:justify-end">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={left} alt="Previous" className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <div className="px-2 flex items-center">...</div>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`p-2 rounded w-8 h-8 flex justify-center items-center font-medium ${
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

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`border border-gray-400 p-2 rounded w-8 h-8 flex justify-center items-center ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={right} alt="Next" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
