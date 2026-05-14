import { useState } from "react";
import { Link } from "react-router-dom";
import Congratulation from "./Congratulation";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../redux/api/authApi";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = ({ email }) => {
  const [passChanged, setPassChanged] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = form;

    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      toast.success(
        res.message || "Your password has been reset successfully!",
      );
      setPassChanged(true);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.data?.password?.[0] || "Failed to reset password. Please try again.",
      );
    }
  };

  return (
    <div>
      {!passChanged ? (
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
              <form onSubmit={handleSubmit}>
                <h3 className="text-gray-500 font-semibold text-xl sm:text-2xl mb-4">
                  Reset Password ?
                </h3>
                <p className="text-gray-500 font-normal text-base mb-4">
                  Enter your new password below to reset your account.
                </p>

                {/* New Password Input */}
                <div className="mb-4">
                  <label className="block text-base mb-1 text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D5B56E] pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff strokeWidth={1} />
                      ) : (
                        <Eye strokeWidth={1} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                  <label className="block text-base mb-1 text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D5B56E] pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff strokeWidth={1} />
                      ) : (
                        <Eye strokeWidth={1} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#D5B56E] hover:bg-[#D5B56E]/90"
                  } text-white font-medium text-lg sm:text-xl py-3 rounded-md transition`}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                {/* Back to Login */}
                <div className="flex items-center justify-center my-4 text-sm text-gray-500">
                  <p>
                    Back to{" "}
                    <Link to="/login" className="text-[#D5B56E] font-medium">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Congratulation />
      )}
    </div>
  );
};

export default ResetPassword;
