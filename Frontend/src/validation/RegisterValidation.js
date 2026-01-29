// Simple validation helpers for Register form

export function validateRegisterForm(values) {
	const errors = {};

	if (!values.fullName?.trim()) {
		errors.fullName = "Vui lòng nhập họ và tên";
	}

	if (!values.email?.trim()) {
		errors.email = "Vui lòng nhập email";
	} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(values.email)) {
		errors.email = "Email không hợp lệ";
	}

	if (!values.phone?.trim()) {
		errors.phone = "Vui lòng nhập số điện thoại";
	} else if (!/^[0-9]{9,11}$/.test(values.phone)) {
		errors.phone = "Số điện thoại không hợp lệ";
	}

	if (!values.birthDate) {
		errors.birthDate = "Vui lòng chọn ngày sinh";
	}

	if (!values.gender) {
		errors.gender = "Vui lòng chọn giới tính";
	}

	if (!values.password) {
		errors.password = "Vui lòng nhập mật khẩu";
	} else if (values.password.length < 6) {
		errors.password = "Mật khẩu phải từ 6 ký tự trở lên";
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
	} else if (values.confirmPassword !== values.password) {
		errors.confirmPassword = "Mật khẩu xác nhận không khớp";
	}

	if (!values.acceptTerms) {
		errors.acceptTerms = "Bạn cần đồng ý với điều khoản và dịch vụ";
	}

	return errors;
}

