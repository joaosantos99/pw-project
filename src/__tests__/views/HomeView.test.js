import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import { useAuth } from "@/composables/useAuth";
import { mockZenQuotesFetch } from "@/__tests__/mocks/fetch";

// Test component that uses useAuth to test authentication behavior
const TestComponent = {
	setup() {
		const { checkSession } = useAuth();
		return { checkSession };
	},
	template: "<div></div>",
};

describe("HomeView", () => {
	let router;
	let pinia;
	let mockFetch;
	let wrapper;

	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);

		router = createRouter({
			history: createWebHistory(),
			routes: [
				{ path: "/", component: HomeView },
				{ path: "/login", component: { template: "<div>Login</div>" } },
			],
		});

		// Mock fetch for zenquotes API
		mockFetch = mockZenQuotesFetch();
		global.fetch = mockFetch;
	});

	afterEach(async () => {
		if (wrapper) {
			wrapper.unmount();
			wrapper = null;
		}
		await nextTick();
		vi.restoreAllMocks();
	});

	it("should redirect to login when not authenticated", async () => {
		// GIVEN: A user is not authenticated
		const authStore = useAuthStore();
		authStore.$patch({
			auth: null,
		});

		await router.push("/");
		await router.isReady();

		// WHEN: Component with useAuth is mounted and checkSession is called
		wrapper = mount(TestComponent, {
			global: {
				plugins: [router, pinia],
			},
		});

		// Set up navigation listener before calling checkSession
		let navigationComplete = false;
		const stopWatching = router.afterEach(() => {
			navigationComplete = true;
		});

		await wrapper.vm.checkSession();

		// Wait for navigation to complete (with timeout)
		const maxWait = 100; // 100ms max wait
		const startTime = Date.now();
		while (!navigationComplete && Date.now() - startTime < maxWait) {
			await new Promise((resolve) => setTimeout(resolve, 5));
		}

		stopWatching();
		await nextTick();

		// THEN: Should redirect to login
		expect(router.currentRoute.value.path).toBe("/login");
	});

	it("should stay on home page when authenticated", async () => {
		// GIVEN: A user is authenticated
		const authStore = useAuthStore();
		authStore.$patch({
			auth: {
				user: { isAdmin: false },
				session: {},
			},
		});

		await router.push("/");
		await router.isReady();

		// WHEN: Component with useAuth is mounted and checkSession is called
		wrapper = mount(TestComponent, {
			global: {
				plugins: [router, pinia],
			},
		});

		await wrapper.vm.checkSession();
		await nextTick();

		// THEN: Should stay on home page
		expect(router.currentRoute.value.path).toBe("/");
	});
});
