import http from "./https";

export function verifyEmail(email, code) {
	return http.post("/auth/verify", null, {
		params: { email, code },
	});
}

// Gửi lại mã xác thực tới email người dùng
export function resendVerifyCode(email) {
	return http.post("/auth/resend-code", null, {
		params: { email },
	});
}

export function login(payload) {
	return http.post("/auth/login", payload);
}

// Giả định backend có endpoint refresh token
// Điều chỉnh URL/body theo API thực tế của bạn
export function refreshToken(refreshToken) {
	return http.post("/auth/refresh-token", {
		refreshToken,
	});
}

// Gửi email quên mật khẩu
export function forgotPassword(email) {
	return http.post("/auth/password/forgot", null, {
		params: { email },
	});
}

// Verify code reset mật khẩu
export function verifyResetPasswordCode(email, code) {
	return http.post("/auth/password/verify", null, {
		params: { email, code },
	});
}

// Đặt lại mật khẩu mới sau khi verify code
export function resetPassword(payload) {
	// payload: { email, newPassword }
	return http.post("/auth/password/reset", payload);
}

