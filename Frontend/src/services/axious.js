import http from "./https";

export function register(payload) {
	return http.post("/auth/register", payload);
}

