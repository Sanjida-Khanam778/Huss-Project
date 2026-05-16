import React from "react";
import { ScrollRestoration } from "react-router-dom";
import { useTermsAndConditionsQuery } from "../redux/api/authApi";

const TermsAndConditions = () => {
  const { data, isLoading, isError } = useTermsAndConditionsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl font-semibold">
          Error loading terms and conditions. Please try again later.
        </p>
      </div>
    );
  }

  const termsContent = data?.content || "No terms and conditions found.";

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 text-gray-800 min-h-screen">
      <ScrollRestoration />
      <div className="max-w-5xl mx-auto">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4">
          <span className="hover:underline cursor-pointer">Home</span> /{" "}
          <span className="text-gray-700 font-medium">Terms of Conditions</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Terms of Conditions
        </h1>
        <div
          className="text-base sm:text-lg lg:text-xl text-left terms-content"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </div>
    </section>
  );
};

export default TermsAndConditions;
