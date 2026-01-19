import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import Quotes from "@/components/Quotes.vue";
import { mockZenQuotesFetch } from "@/__tests__/mocks/fetch";

describe("Quotes", () => {
	let mockFetch;
	let wrapper;

	beforeEach(() => {
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

	it("should display loading state initially", async () => {
		// WHEN: The Quotes component is mounted
		wrapper = mount(Quotes);

		// THEN: Loading message should be displayed
		expect(wrapper.text()).toContain("Loading quote...");
		expect(wrapper.text()).toContain("Daily Inspiration");
		expect(wrapper.text()).toContain("Words of wisdom to keep you motivated");
	});

	it("should fetch and display quote after mount", async () => {
		// WHEN: The Quotes component is mounted
		wrapper = mount(Quotes);

		// Wait for fetch to complete
		await nextTick();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// THEN: Quote and author should be displayed
		expect(mockFetch).toHaveBeenCalledWith("/api/zenquotes/random");
		expect(wrapper.text()).toContain("The only way to do great work is to love what you do.");
		expect(wrapper.text()).toContain("Steve Jobs");
		expect(wrapper.text()).not.toContain("Loading quote...");
	});

	it("should display error message when fetch fails", async () => {
		// GIVEN: Fetch will fail
		const errorFetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				status: 500,
				json: async () => ({}),
			}),
		);
		global.fetch = errorFetch;

		// WHEN: The Quotes component is mounted
		wrapper = mount(Quotes);

		// Wait for fetch to complete
		await nextTick();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// THEN: Error message should be displayed
		expect(wrapper.text()).toContain("Failed to load quote");
		expect(wrapper.text()).not.toContain("Loading quote...");
		expect(wrapper.text()).not.toContain("The only way to do great work");
	});
});
