import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";

import { useAuthStore } from "@/stores/auth";
import Sidebar from "@/components/Sidebar.vue";

describe("Sidebar", () => {
	let router;
	let pinia;

	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);

		router = createRouter({
			history: createWebHistory(),
			routes: [
				{ path: "/", component: { template: "<div>Home</div>" } },
				{ path: "/timer", component: { template: "<div>Timer</div>" } },
				{ path: "/goals", component: { template: "<div>Goals</div>" } },
				{ path: "/subjects", component: { template: "<div>Subjects</div>" } },
				{ path: "/sessions", component: { template: "<div>Sessions</div>" } },
				{ path: "/profile", component: { template: "<div>Profile</div>" } },
				{ path: "/users", component: { template: "<div>Users</div>" } },
			],
		});
	});

	it("should render all menu items for non-admin users", async () => {
		// GIVEN: A non-admin user is authenticated
		const authStore = useAuthStore();
		authStore.$patch({
			auth: {
				user: { isAdmin: false },
				session: {},
			},
		});

		await router.push("/");

		// WHEN: The Sidebar component is rendered
		const wrapper = mount(Sidebar, {
			global: {
				plugins: [router, pinia],
			},
		});

		// THEN: All standard menu items should be displayed
		const menuItems = wrapper.findAllComponents({ name: "MenuItem" });
		expect(menuItems.length).toBe(6);
		expect(wrapper.text()).toContain("Home");
		expect(wrapper.text()).toContain("Timer");
		expect(wrapper.text()).toContain("Goals");
		expect(wrapper.text()).toContain("Subjects");
		expect(wrapper.text()).toContain("Sessions");
		expect(wrapper.text()).toContain("Profile");
		expect(wrapper.text()).not.toContain("Users");
	});

	it("should render Users menu item for admin users", async () => {
		// GIVEN: An admin user is authenticated
		const authStore = useAuthStore();
		authStore.$patch({
			auth: {
				user: { isAdmin: true },
				session: {},
			},
		});

		await router.push("/");

		// WHEN: The Sidebar component is rendered
		const wrapper = mount(Sidebar, {
			global: {
				plugins: [router, pinia],
			},
		});

		// THEN: The Users menu item should be displayed along with other items
		const menuItems = wrapper.findAllComponents({ name: "MenuItem" });
		expect(menuItems.length).toBe(7);
		expect(wrapper.text()).toContain("Home");
		expect(wrapper.text()).toContain("Timer");
		expect(wrapper.text()).toContain("Goals");
		expect(wrapper.text()).toContain("Subjects");
		expect(wrapper.text()).toContain("Sessions");
		expect(wrapper.text()).toContain("Profile");
		expect(wrapper.text()).toContain("Users");
	});

	it("should mark menu item as active when route matches", async () => {
		// GIVEN: A non-admin user is authenticated and on the timer route
		const authStore = useAuthStore();
		authStore.$patch({
			auth: {
				user: { isAdmin: false },
				session: {},
			},
		});

		await router.push("/timer");

		// WHEN: The Sidebar component is rendered
		const wrapper = mount(Sidebar, {
			global: {
				plugins: [router, pinia],
			},
		});

		// THEN: The Timer menu item should be marked as active
		const menuItems = wrapper.findAllComponents({ name: "MenuItem" });
		const timerItem = menuItems.find((item) => item.props("label") === "Timer");
		expect(timerItem.props("isActive")).toBe(true);
	});
});
