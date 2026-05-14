import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ResetPassword from "./ResetPassword";
import { useVerifyOtpMutation, useSendOtpMutation } from "../redux/api/authApi";

const Verify = ({ email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verifyOtpApi, { isLoading }] = useVerifyOtpMutation();
  const [sendOtpApi, { isLoading: isSending }] = useSendOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // OTP ইনপুট হ্যান্ডলার
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return false;

    setOtp([...otp.map((data, idx) => (idx === index ? value : data))]);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  // OTP পেস্ট হ্যান্ডলার
  const handlePaste = (e, index) => {
    const pastedValue = e.clipboardData.getData("Text");
    const newOtp = [...otp];

    // পেস্ট করা ভ্যালু ৪টি ইনপুটে সঠিকভাবে বিভক্ত হবে
    for (let i = 0; i < pastedValue.length; i++) {
      if (index + i < 4) {
        newOtp[index + i] = pastedValue[i];
      }
    }

    setOtp(newOtp);

    // পরবর্তী ইনপুট ফোকাস করা
    if (index + pastedValue.length < otp.length) {
      document
        .getElementById(`otp-input-${index + pastedValue.length}`)
        .focus();
    }
  };

  // OTP ভ্যালিডেশন
  const verifyOtp = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const otpString = otp.join("");

    try {
      const res = await verifyOtpApi({ email, otp: otpString }).unwrap();
      toast.success(res.message || "OTP Verified Successfully!");
      setIsVerified(true);
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isSending) return;

    try {
      const res = await sendOtpApi({ email }).unwrap();
      toast.success(res.message || "OTP sent successfully!");
      setCountdown(60);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div>
      {!isVerified ? (
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
          <div className="bg-[#f9f6ee] pt-8 pb-14 flex flex-col items-center justify-center px-4">
            {/* Login Box */}
            <div className="w-full max-w-md border border-[#D5B56E] rounded-md p-6 sm:p-8 bg-white shadow-md">
              <form onSubmit={verifyOtp}>
                <h3 className="text-gray-500 font-semibold text-xl sm:text-2xl mb-4">
                  Verify OTP
                </h3>
                <p className="text-gray-500 font-normal text-base mb-4">
                  We have sent a 4-digit code to your email.{" "}
                </p>

                {/* OTP Input Boxes */}
                <div className="mb-4 flex justify-between gap-2 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      id={`otp-input-${index}`}
                      maxLength="1"
                      onChange={(e) => handleOtpChange(e, index)}
                      onPaste={(e) => handlePaste(e, index)}
                      placeholder="0"
                      className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-16 font-semibold text-lg sm:text-xl text-center bg-[#FFEFC4] border border-[#FFBA07] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D5B56E]"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit" // Important: ensure it's of type 'submit'
                  disabled={isLoading}
                  className={`w-full ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#D5B56E] hover:bg-[#D5B56E]/90"} text-white font-medium text-lg sm:text-xl py-3 rounded-md transition mt-4`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center my-4 text-sm font-medium text-gray-500">
                  <p>
                    Didn't get the code?{" "}
                    <span
                      onClick={handleResendOtp}
                      className={`cursor-pointer ${countdown > 0 || isSending ? 'text-gray-400 cursor-not-allowed' : 'text-[#D5B56E]'}`}
                    >
                      Resend OTP {countdown > 0 && `(${countdown}s)`}
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <ResetPassword email={email} />
      )}
    </div>
  );
};

export default Verify;
