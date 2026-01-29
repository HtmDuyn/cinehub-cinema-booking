import axios from "axios";

const http = axios.create({
	baseURL:
		import.meta.env.VITE_API_BASE_URL ||
		"https://unlustful-uncontentious-lora.ngrok-free.dev/api",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 15000,
});

http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

http.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error);
	}
);

export default http;

