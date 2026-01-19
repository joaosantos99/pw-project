import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import { useAuthStore } from "@/stores/auth";
import LoginView from "@/views/LoginView.vue";
import { mockLoginFetch } from "@/__tests__/mocks/fetch";

describe("LoginView", () => {
	let router;
	let pinia;
	let mockFetchFn;
	let wrapper;

	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);

		router = createRouter({
			history: createWebHistory(),
			routes: [
				{ path: "/", component: { template: "<div>Home</div>" } },
				{ path: "/login", component: LoginView },
			],
		});

		// Mock fetch for login API calls
		mockFetchFn = mockLoginFetch();
		global.fetch = mockFetchFn;
	});

	afterEach(async () => {
		if (wrapper) {
			wrapper.unmount();
			wrapper = null;
		}
		await nextTick();
		vi.restoreAllMocks();
	});

	it("should redirect to home page when user logs in successfully", async () => {
		// GIVEN: A user is not authenticated and on the login page
		const authStore = useAuthStore();
		authStore.$patch({
			auth: null,
		});

		await router.push("/login");
		await router.isReady();

		// WHEN: Component is mounted
		wrapper = mount(LoginView, {
			global: {
				plugins: [router, pinia],
			},
		});

		// Fill in the form
		const emailInput = wrapper.find('input[name="email"]');
		const passwordInput = wrapper.find('input[name="password"]');
		const form = wrapper.find("form");

		await emailInput.setValue("test@example.com");
		await passwordInput.setValue("password123");

		// Set up navigation listener before submitting
		let navigationComplete = false;
		const stopWatching = router.afterEach(() => {
			navigationComplete = true;
		});

		// Submit the form
		await form.trigger("submit");

		// Wait for login to complete and navigation to happen
		const maxWait = 500; // 500ms max wait
		const startTime = Date.now();
		while (!navigationComplete && Date.now() - startTime < maxWait) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}

		stopWatching();
		await nextTick();

		// THEN: Should redirect to home page
		expect(router.currentRoute.value.path).toBe("/");
		expect(authStore.isAuthenticated).toBe(true);
	});
});
