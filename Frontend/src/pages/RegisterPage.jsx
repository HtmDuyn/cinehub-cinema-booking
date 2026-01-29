import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../validation/RegisterValidation";
import { register as registerApi } from "../services/axious";
import { verifyEmail, resendVerifyCode } from "../services/authService";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [verifyCode, setVerifyCode] = useState("");
	const [verifyError, setVerifyError] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [formValues, setFormValues] = useState({
		fullName: "",
		email: "",
		phone: "",
		birthDate: "",
		gender: "",
		password: "",
		confirmPassword: "",
		acceptTerms: false,
	});
	const [formErrors, setFormErrors] = useState({});
	const [apiError, setApiError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const otpInputsRef = useRef([]);

	const handleChange = (field) => (e) => {
		const value = field === "acceptTerms" ? e.target.checked : e.target.value;
		setFormValues((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmitRegister = async () => {
		const errors = validateRegisterForm(formValues);
		setFormErrors(errors);
		setApiError("");
		if (Object.keys(errors).length !== 0) return;

		try {
			setIsSubmitting(true);
			const payload = {
				// backend yêu cầu các trường: username, password, email, phoneNumber, fullName, dob, termsAccepted
				username: formValues.fullName,
				password: formValues.password,
				email: formValues.email,
				phoneNumber: formValues.phone,
				fullName: formValues.fullName,
				dob: formValues.birthDate,
				termsAccepted: formValues.acceptTerms,
			};
			const res = await registerApi(payload);
			// backend hiện tại trả token = null sau khi đăng ký
			// người dùng cần nhập mã xác thực được gửi về email để kích hoạt tài khoản
			if (res?.status === 200) {
				setVerifyCode("");
				setVerifyError("");
				setShowVerifyModal(true);
			}
		} catch (err) {
			setApiError(
				err?.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyCode = async () => {
		if (verifyCode.length !== 6) {
			setVerifyError("Vui lòng nhập đủ 6 số.");
			return;
		}
		try {
			setIsVerifying(true);
			setVerifyError("");
			const res = await verifyEmail(formValues.email, verifyCode);
			const { token, refreshToken, username, role, id } = res?.data || {};
			if (token) {
				const now = Date.now();
				localStorage.setItem("accessToken", token);
				if (refreshToken)
					localStorage.setItem("refreshToken", refreshToken);
				localStorage.setItem("lastActivity", String(now));
				if (username) localStorage.setItem("username", username);
				if (role) localStorage.setItem("role", role);
				if (id !== undefined) localStorage.setItem("userId", String(id));
			}
			setShowVerifyModal(false);
			navigate("/");
		} catch (err) {
			setVerifyError(
				err?.response?.data?.message ||
					"Mã xác thực không hợp lệ hoặc đã hết hạn."
			);
		} finally {
			setIsVerifying(false);
		}
	};

	const [isResending, setIsResending] = useState(false);

	const handleResendCode = async () => {
		if (!formValues.email) return;
		try {
			setIsResending(true);
			setVerifyError("");
			setVerifyCode("");
			const res = await resendVerifyCode(formValues.email);
			// backend trả token = null khi resend, chỉ cần coi như gửi lại mã thành công
			if (res?.status === 200) {
				// có thể hiển thị thông báo nhẹ nếu cần, hiện tại chỉ reset mã
			}
		} catch (err) {
			setVerifyError(
				err?.response?.data?.message ||
					"Gửi lại mã thất bại, vui lòng thử lại."
			);
		} finally {
			setIsResending(false);
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
			<div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col lg:flex-row">
				{/* Left visual panel */}
				<div className="relative w-full lg:w-1/2 h-60 sm:h-72 lg:h-auto overflow-hidden">
					<img
						alt="Cinema seats"
						src="https://www.profitableventure.com/wp-content/uploads/2019/12/Movie-Theater-Business.jpg.webp"
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent" />
					<div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-10 lg:px-12 text-white">
						<p className="text-sm font-semibold tracking-wide text-yellow-400 uppercase mb-2">
							CINEHUBS THÀNH VIÊN
						</p>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
							Tham Gia
							<br />
							CineHubs Ngay
							<br />
							Hôm Nay!
						</h1>
						<p className="mt-4 text-sm sm:text-base text-slate-100/80 max-w-md">
							Đăng ký tài khoản để trải nghiệm hàng ngàn bộ phim chất lượng cao, đặt vé nhanh chóng
							và nhận nhiều ưu đãi hấp dẫn dành riêng cho thành viên.
						</p>
						<div className="mt-6 space-y-2 text-sm text-slate-100/90">
							<div className="flex items-center gap-2">
								<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px]">
									✓
								</span>
								<span>Đặt vé online dễ dàng, không cần xếp hàng.</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px]">
									★
								</span>
								<span>Ưu đãi độc quyền cho thành viên CineHubs.</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-400 text-[10px]">
									🎟
								</span>
								<span>Lưu lịch sử giao dịch và vé chỉ trong một chạm.</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right form panel */}
				<div className="w-full lg:w-1/2 bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 px-6 sm:px-10 lg:px-12 py-7 sm:py-9 lg:py-10 flex flex-col">
					<div className="mb-3 sm:mb-4">
						<h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
							Đăng Ký
						</h2>
						<p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300 text-center">
							Tạo tài khoản mới để bắt đầu hành trình xem phim của bạn.
						</p>
					</div>

					<form className="space-y-3 sm:space-y-4 text-sm">
						<div>
							<label className="block mb-1 text-slate-200">Họ và tên</label>
							<input
								type="text"
								className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
								placeholder="Nguyễn Văn A"
								value={formValues.fullName}
								onChange={handleChange("fullName")}
							/>
							{formErrors.fullName && (
								<p className="mt-1 text-xs text-red-400">{formErrors.fullName}</p>
							)}
						</div>
						<div>
							<label className="block mb-1 text-slate-200">Email</label>
							<input
								type="email"
								className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
								placeholder="example@email.com"
								value={formValues.email}
								onChange={handleChange("email")}
							/>
							{formErrors.email && (
								<p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
							)}
						</div>
						<div>
							<label className="block mb-1 text-slate-200">Số điện thoại</label>
							<input
								type="tel"
								className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
								placeholder="0898520071"
								value={formValues.phone}
								onChange={handleChange("phone")}
							/>
							{formErrors.phone && (
								<p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>
							)}
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-slate-200">Ngày sinh</label>
								<input
									type="date"
									className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10 [color-scheme:dark]"
									value={formValues.birthDate}
									onChange={handleChange("birthDate")}
								/>
								{formErrors.birthDate && (
									<p className="mt-1 text-xs text-red-400">{formErrors.birthDate}</p>
								)}
							</div>
							<div>
								<label className="block mb-1 text-slate-200">Giới tính</label>
								<select
									className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
									value={formValues.gender}
									onChange={handleChange("gender")}
								>
									<option value="" disabled className="bg-slate-900">
										Chọn giới tính
									</option>
									<option value="male" className="bg-slate-900">
										Nam
									</option>
									<option value="female" className="bg-slate-900">
										Nữ
									</option>
									<option value="other" className="bg-slate-900">
										Khác
									</option>
								</select>
								{formErrors.gender && (
									<p className="mt-1 text-xs text-red-400">{formErrors.gender}</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-slate-200">Mật khẩu</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
										placeholder="••••••••"
										value={formValues.password}
										onChange={handleChange("password")}
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
								{formErrors.password && (
									<p className="mt-1 text-xs text-red-400">{formErrors.password}</p>
								)}
							</div>
							<div>
								<label className="block mb-1 text-slate-200">Xác nhận mật khẩu</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
										placeholder="••••••••"
										value={formValues.confirmPassword}
										onChange={handleChange("confirmPassword")}
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
								{formErrors.confirmPassword && (
									<p className="mt-1 text-xs text-red-400">{formErrors.confirmPassword}</p>
								)}
							</div>
						</div>

						<div className="flex items-start gap-3 pt-1 text-xs sm:text-sm text-slate-300">
							<input
								type="checkbox"
								className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/70"
								checked={formValues.acceptTerms}
								onChange={handleChange("acceptTerms")}
							/>
							<p>
								Tôi đồng ý với <span className="text-yellow-400 cursor-pointer hover:underline">điều khoản</span> và
								<span className="text-yellow-400 cursor-pointer hover:underline"> dịch vụ</span> của CineHubs.
							</p>
						</div>
						{formErrors.acceptTerms && (
							<p className="mt-1 text-xs text-red-400">{formErrors.acceptTerms}</p>
						)}

						<button
							type="button"
							onClick={handleSubmitRegister}
							className="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
						</button>
						{apiError && (
							<p className="mt-2 text-xs text-red-400 text-center">{apiError}</p>
						)}

						<div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
							<div className="h-px flex-1 bg-white/10" />
							<span>Hoặc đăng ký với</span>
							<div className="h-px flex-1 bg-white/10" />
						</div>

						<button
							type="button"
							className="mt-3 w-full rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:bg-white/10 transition"
						>
							<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-900 text-xs font-bold">
								G
							</span>
							<span>Google</span>
						</button>
					</form>

					<p className="mt-6 text-center text-xs sm:text-sm text-slate-300">
						Đã có tài khoản? <span className="text-yellow-400 cursor-pointer hover:underline" onClick={() => navigate("/login")}>
							Đăng nhập ngay
						</span>
					</p>
				</div>
			</div>

			{showVerifyModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
					<div className="w-full max-w-md rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-6 sm:p-7 relative">
						<button
							type="button"
							onClick={() => setShowVerifyModal(false)}
							className="absolute right-4 top-3 text-slate-300 hover:text-white text-xl leading-none"
						>
							×
						</button>
						<h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-1">
							Xác Thực Email
						</h3>
						<p className="text-xs sm:text-sm text-slate-300 text-center mb-4">
							Chúng tôi đã gửi mã xác nhận 6 số tới email của bạn. Vui lòng nhập mã để kích hoạt tài khoản.
						</p>
						<div className="flex justify-center gap-2 sm:gap-3 mb-5">
							{[0, 1, 2, 3, 4, 5].map((idx) => (
								<input
									key={idx}
									maxLength={1}
									value={verifyCode[idx] || ""}
									ref={(el) => {
										otpInputsRef.current[idx] = el;
									}}
									onChange={(e) => {
										const raw = e.target.value.replace(/[^0-9]/g, "");
										const digit = raw.slice(-1); // chỉ lấy 1 ký tự cuối
										setVerifyCode((prev) => {
											const chars = prev.split("");
											chars[idx] = digit;
											return chars.join("").slice(0, 6);
										});

										// tự động nhảy sang ô tiếp theo nếu có số
										if (digit && idx < 5) {
											const next = otpInputsRef.current[idx + 1];
											if (next) next.focus();
										}
									}}
									onKeyDown={(e) => {
										if (e.key === "Backspace" && !verifyCode[idx] && idx > 0) {
											const prevInput = otpInputsRef.current[idx - 1];
											if (prevInput) prevInput.focus();
										}
									}}
									className="h-11 w-9 sm:h-12 sm:w-10 text-center text-lg font-semibold rounded-lg bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/80"
								/>
							))}
						</div>
						{verifyError && (
							<p className="mb-3 text-xs text-red-400 text-center">{verifyError}</p>
						)}
						<button
							type="button"
							onClick={handleVerifyCode}
							className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition mb-3"
						>
							{isVerifying ? "Đang xác thực..." : "Xác Nhận Mã"}
						</button>
						<button
							type="button"
								onClick={handleResendCode}
								className="w-full text-xs sm:text-sm text-slate-300 hover:text-white disabled:opacity-60"
								disabled={isResending}
						>
								Chưa nhận được mã? {" "}
								<span className="text-yellow-400 hover:underline">
									{isResending ? "Đang gửi lại..." : "Gửi lại mã"}
								</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
