import { vi } from "vitest";

export const mockFetch = ({ response, status = 200, ok = true }) => {
	return vi.fn(() =>
		Promise.resolve({
			ok,
			status,
			json: async () => response,
		}),
	);
};

export const mockZenQuotesFetch = () => {
	const mockResponse = [
		{
			q: "The only way to do great work is to love what you do.",
			a: "Steve Jobs",
		},
	];

	return vi.fn((url) => {
		if (url.includes("/api/zenquotes/random")) {
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			});
		}
		// For other URLs, return a rejected promise or use real fetch
		return Promise.reject(new Error(`Unmocked fetch call to: ${url}`));
	});
};

export const mockLoginFetch = ({ user = null, session = null } = {}) => {
	const defaultUser = {
		id: 1,
		name: "Test User",
		email: "test@example.com",
		password: "password123",
		isAdmin: false,
		...user,
	};

	const defaultSession = {
		user_id: 1,
		secret: "mock-secret",
		...session,
	};

	return vi.fn((url, options) => {
		if (url.includes("/users?email=")) {
			// Mock successful user lookup
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => [defaultUser],
			});
		}
		if (url.includes("/sessions") && options?.method === "POST") {
			// Mock successful session creation
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => defaultSession,
			});
		}
		// For other URLs, return a rejected promise
		return Promise.reject(new Error(`Unmocked fetch call to: ${url}`));
	});
};
