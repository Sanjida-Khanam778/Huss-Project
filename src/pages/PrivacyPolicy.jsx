import { ScrollRestoration } from "react-router-dom";
import { usePrivacyPolicyQuery } from "../redux/api/authApi";

const PrivacyPolicy = () => {
  const { data, isLoading, isError } = usePrivacyPolicyQuery();

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
          Error loading privacy policy. Please try again later.
        </p>
      </div>
    );
  }

  const policyContent = data?.content || "No privacy policy found.";

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 text-gray-800 min-h-screen">
      <ScrollRestoration />
      <div className="max-w-5xl mx-auto">
        <nav className="text-xs sm:text-sm text-gray-500 mb-4">
          <span className="hover:underline cursor-pointer">Home</span> /{" "}
          <span className="text-gray-700 font-medium">Privacy Policy</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Privacy Policy</h1>
        <div
          className="text-base sm:text-lg lg:text-xl text-left policy-content"
          dangerouslySetInnerHTML={{ __html: policyContent }}
        />
      </div>
    </section>
  );
};

export default PrivacyPolicy;
