import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyResetPasswordCode, resetPassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    const verifyCode = async () => {
      if (!email || !code) {
        setError("Liên kết không hợp lệ hoặc đã hết hạn.");
        setIsCodeValid(false);
        return;
      }
      try {
        setIsVerifying(true);
        setError("");
        await verifyResetPasswordCode(email, code);
        setIsCodeValid(true);
      } catch (err) {
        setIsCodeValid(false);
        setError(
          err?.response?.data?.message ||
            "Mã reset không hợp lệ hoặc đã hết hạn."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    void verifyCode();
  }, [email, code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !code) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (!isCodeValid) {
      setError("Mã reset không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu mới.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ email, newPassword: password });

      setSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Đặt lại mật khẩu thất bại, vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white self-start max-w-[1200px] w-full"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </span>
        <span>Quay lại trang chủ</span>
      </button>

      <div className="w-full max-w-3xl mx-auto rounded-3xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col md:flex-row">
        {/* Left visual panel */}
        <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-auto overflow-hidden">
          <img
            alt="Reset password background"
            src="https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1600"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-10 text-white">
            <p className="text-sm font-semibold tracking-wide text-sky-300 uppercase mb-2">
              BẢO MẬT TÀI KHOẢN
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              Đặt Lại
              <br />
              Mật Khẩu Của Bạn
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-100/80 max-w-xs">
              Vui lòng tạo mật khẩu mới mạnh và bảo mật để tiếp tục sử dụng CineHubs.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 px-6 sm:px-8 md:px-10 py-7 sm:py-9 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Mật Khẩu Mới
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 text-center">
              Nhập và xác nhận mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>

          {isVerifying && (
            <p className="mb-3 text-xs sm:text-sm text-center text-slate-300">
              Đang kiểm tra mã reset, vui lòng chờ...
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 text-slate-200">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12s2.25-6 9.75-6 9.75 6 9.75 6-2.25 6-9.75 6-9.75-6-9.75-6z"
                    />
                    <circle cx="12" cy="12" r="3.25" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-200">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12s2.25-6 9.75-6 9.75 6 9.75 6-2.25 6-9.75 6-9.75-6-9.75-6z"
                    />
                    <circle cx="12" cy="12" r="3.25" />
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
            {success && (
              <p className="text-xs text-emerald-400 mt-1">{success}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email || !code || !isCodeValid}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang cập nhật mật khẩu..." : "Cập Nhật Mật Khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
