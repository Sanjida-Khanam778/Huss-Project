import { useState } from "react";
import welcome from "../assets/img/welcome.png";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Congratulation = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to Verify component without changing routes
    navigate("/login");
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-28 py-3 text-left text-sm text-black font-medium">
        <span className="text-gray-600 font-medium text-lg sm:text-xl">
          Account /{" "}
        </span>
        <span className="text-black font-bold text-lg sm:text-xl">
          Forget Password
        </span>
      </div>

      {/* Reset Password Form */}
      <div className="bg-[#f9f6ee] pt-8 pb-14 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md border border-[#D5B56E] rounded-md p-6 sm:p-8 bg-white shadow-md">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <img src={welcome} alt="" />
            <h3 className="text-gray-500 font-semibold text-xl sm:text-2xl mb-4">
              Congratulations!
            </h3>
            <p className="text-gray-500 font-normal text-base mb-4">
              You are ready to explore our web!
            </p>

            {/* Explore Button */}
            <button
              type="submit"
              className="w-full bg-[#D5B56E] hover:bg-[#D5B56E]/90 text-white font-medium text-lg sm:text-xl py-3 rounded-md transition"
            >
              Explore
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Congratulation;
