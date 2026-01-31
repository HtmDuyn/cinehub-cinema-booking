import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	login as loginApi,
	forgotPassword as forgotPasswordApi,
	verifyResetPasswordCode,
	resetPassword,
} from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { login: setAuthUser } = useAuth();
	const [showForgotModal, setShowForgotModal] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotMessage, setForgotMessage] = useState("");
	const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
	const [forgotStep, setForgotStep] = useState("email"); // email | code | reset | done
	const [forgotCode, setForgotCode] = useState("");
	const [forgotError, setForgotError] = useState("");
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	const [resetNewPassword, setResetNewPassword] = useState("");
	const [resetConfirmPassword, setResetConfirmPassword] = useState("");
	const [isResetSubmitting, setIsResetSubmitting] = useState(false);
	const [showResetPassword, setShowResetPassword] = useState(false);
	const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!identifier || !password) {
			setError("Vui lòng nhập email hoặc số điện thoại và mật khẩu.");
			return;
		}

		try {
			setIsSubmitting(true);
			// Backend yêu cầu body: { username, password }
			// Ở đây người dùng nhập email và backend đang dùng email làm username
			const res = await loginApi({ username: identifier, password });
			const {
				token,
				refreshToken,
				username,
				role,
				id,
				email: userEmail,
				fullName,
				phoneNumber,
				membershipScore,
				dob,
			} = res?.data || {};
			if (token) {
				const now = Date.now();
				localStorage.setItem("accessToken", token);
				if (refreshToken)
					localStorage.setItem("refreshToken", refreshToken);
				localStorage.setItem("lastActivity", String(now));
				if (username) localStorage.setItem("username", username);
				if (role) localStorage.setItem("role", role);
				if (id !== undefined) localStorage.setItem("userId", String(id));
				if (userEmail) localStorage.setItem("email", userEmail);
				if (fullName) localStorage.setItem("fullName", fullName);
				if (phoneNumber) localStorage.setItem("phoneNumber", phoneNumber);
				if (membershipScore !== undefined && membershipScore !== null)
					localStorage.setItem("membershipScore", String(membershipScore));
				if (dob) localStorage.setItem("dob", dob);
			}
			setAuthUser({
				username: username || identifier,
				role,
				id,
				email: userEmail,
				fullName,
				phoneNumber,
				membershipScore,
				dob,
			});
			navigate("/");
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				"Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản hoặc mật khẩu.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		if (!forgotEmail) {
			setForgotError("Vui lòng nhập email.");
			return;
		}
		try {
			setIsForgotSubmitting(true);
			setForgotError("");
			setForgotMessage("");
			const res = await forgotPasswordApi(forgotEmail);
			const message =
				res?.data?.message ||
				"Nếu email tồn tại, mã xác nhận sẽ được gửi tới email của bạn.";
			setForgotMessage(message);
			setForgotStep("code");
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				"Gửi yêu cầu quên mật khẩu thất bại, vui lòng thử lại.";
			setForgotError(message);
		} finally {
			setIsForgotSubmitting(false);
		}
	};

	const handleVerifyForgotCode = async () => {
		if (!forgotCode || forgotCode.length !== 6) {
			setForgotError("Vui lòng nhập đủ 6 số trong mã xác nhận.");
			return;
		}
		try {
			setIsVerifyingCode(true);
			setForgotError("");
			setForgotMessage("");
			await verifyResetPasswordCode(forgotEmail, forgotCode);
			setForgotMessage("Mã hợp lệ, bạn có thể đặt lại mật khẩu mới.");
			setForgotStep("reset");
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				"Mã xác nhận không hợp lệ hoặc đã hết hạn.";
			setForgotError(message);
		} finally {
			setIsVerifyingCode(false);
		}
	};

	const handleResetPasswordInModal = async () => {
		if (!resetNewPassword || !resetConfirmPassword) {
			setForgotError("Vui lòng nhập đầy đủ mật khẩu mới.");
			return;
		}
		if (resetNewPassword.length < 6) {
			setForgotError("Mật khẩu mới cần ít nhất 6 ký tự.");
			return;
		}
		if (resetNewPassword !== resetConfirmPassword) {
			setForgotError("Mật khẩu xác nhận không khớp.");
			return;
		}
		try {
			setIsResetSubmitting(true);
			setForgotError("");
			setForgotMessage("");
			await resetPassword({ email: forgotEmail, newPassword: resetNewPassword });
			setForgotMessage(
				"Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập lại."
			);
			setForgotStep("done");
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				"Đặt lại mật khẩu thất bại, vui lòng thử lại.";
			setForgotError(message);
		} finally {
			setIsResetSubmitting(false);
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
							Chào mừng
							<br />
							Trở lại với
							<br />
							CineHubs
						</h1>
						<p className="mt-4 text-sm sm:text-base text-slate-100/80 max-w-md">
							Đăng nhập để tiếp tục đặt vé, theo dõi ưu đãi và thưởng thức những bộ phim yêu thích của bạn.
						</p>
					</div>
				</div>

				{/* Right form panel */}
				<div className="w-full lg:w-1/2 bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 px-6 sm:px-10 lg:px-12 py-7 sm:py-9 lg:py-10 flex flex-col">
					<div className="mb-4">
						<h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
							Đăng Nhập
						</h2>
						<p className="mt-2 text-xs sm:text-sm text-slate-300 text-center">
							Chào mừng bạn quay lại với CineHubs.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4 text-sm">
						<div>
							<label className="block mb-1 text-slate-200">Email/Sdt</label>
							<input
								type="text"
								className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
								placeholder="Nhập email hoặc số điện thoại"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
							/>
						</div>
						<div>
							<label className="block mb-1 text-slate-200">Mật khẩu</label>
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

						<div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
							<div className="flex items-center gap-2">
								<input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/70" />
								<span>Ghi nhớ đăng nhập</span>
							</div>
							<button
								type="button"
								onClick={() => {
									setShowForgotModal(true);
									setForgotMessage("");
									setForgotError("");
									setForgotStep("email");
									setForgotEmail("");
									setForgotCode("");
									setResetNewPassword("");
									setResetConfirmPassword("");
									setShowResetPassword(false);
									setShowResetConfirmPassword(false);
								}}
								className="text-yellow-400 hover:underline"
							>
								Quên mật khẩu?
							</button>
						</div>

						{error && (
							<p className="mt-1 text-xs text-red-400">{error}</p>
						)}

						<button
							type="submit"
							className="mt-3 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
						</button>

						<div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
							<div className="h-px flex-1 bg-white/10" />
							<span>Hoặc đăng nhập với</span>
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
						Chưa có tài khoản? {" "}
						<Link to="/register" className="text-yellow-400 hover:underline">
							Đăng ký ngay
						</Link>
					</p>
				</div>
			</div>

			{showForgotModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
					<div className="w-full max-w-md rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-6 sm:p-7 relative">
						<button
							type="button"
							onClick={() => setShowForgotModal(false)}
							className="absolute right-4 top-3 text-slate-300 hover:text-white text-xl leading-none"
						>
							×
						</button>
						<h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-1">
							Quên Mật Khẩu
						</h3>
						<p className="text-xs sm:text-sm text-slate-300 text-center mb-4">
							{forgotStep === "email"
								? "Nhập email bạn đã đăng ký để nhận mã xác nhận đặt lại mật khẩu."
								: forgotStep === "code"
								? `Nhập mã 6 số đã được gửi tới ${forgotEmail}.`
								: forgotStep === "reset"
								? "Nhập mật khẩu mới và xác nhận để hoàn tất."
								: "Mật khẩu đã được đặt lại thành công, bạn có thể đăng nhập lại."
							}
						</p>
						<div className="space-y-3 text-sm">
							{forgotStep === "email" && (
								<>
									<input
										type="email"
										className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
										placeholder="Nhập email của bạn"
										value={forgotEmail}
										onChange={(e) => setForgotEmail(e.target.value)}
									/>
									<button
										type="button"
										onClick={handleForgotPassword}
										disabled={isForgotSubmitting}
										className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{isForgotSubmitting ? "Đang gửi..." : "Gửi mã xác nhận"}
									</button>
								</>
							)}

							{forgotStep === "code" && (
								<>
									<input
										type="text"
										maxLength={6}
										className="w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white tracking-[0.3em] text-center placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
										placeholder="Nhập mã 6 số"
										value={forgotCode}
										onChange={(e) => {
											const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
											setForgotCode(onlyDigits.slice(0, 6));
										}}
									/>
									<button
										type="button"
										onClick={handleVerifyForgotCode}
										disabled={isVerifyingCode}
										className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{isVerifyingCode ? "Đang xác nhận..." : "Xác nhận mã"}
									</button>
								</>
							)}

							{forgotStep === "reset" && (
								<>
									<div>
										<label className="block mb-1 text-slate-200">Mật khẩu mới</label>
										<div className="relative">
											<input
												type={showResetPassword ? "text" : "password"}
												className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
												placeholder="••••••••"
												value={resetNewPassword}
												onChange={(e) => setResetNewPassword(e.target.value)}
											/>
											<button
												type="button"
												onClick={() => setShowResetPassword((prev) => !prev)}
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
												type={showResetConfirmPassword ? "text" : "password"}
												className="w-full rounded-lg border bg-white/5 pr-10 pl-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent border-white/10"
												placeholder="••••••••"
												value={resetConfirmPassword}
												onChange={(e) => setResetConfirmPassword(e.target.value)}
											/>
											<button
												type="button"
												onClick={() => setShowResetConfirmPassword((prev) => !prev)}
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
									<button
										type="button"
										onClick={handleResetPasswordInModal}
										disabled={isResetSubmitting}
										className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.5)] hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{isResetSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
									</button>
								</>
							)}

							{forgotStep === "done" && (
								<button
									type="button"
									onClick={() => {
										setShowForgotModal(false);
										if (forgotEmail) {
											setIdentifier(forgotEmail);
										}
									}}
									className="w-full rounded-lg bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.5)] hover:brightness-110 transition"
								>
									Quay lại đăng nhập
								</button>
							)}

							{forgotError && (
								<p className="text-xs text-center text-red-400 mt-1">{forgotError}</p>
							)}
							{forgotMessage && (
								<p className="text-xs text-center text-slate-200 mt-1">{forgotMessage}</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
