<script>
import { ref, onMounted } from "vue";

export default {
	name: "Quotes",

	setup() {
		const quote = ref(null);
		const author = ref(null);
		const loading = ref(true);
		const error = ref(null);

		// Fetch a random quote from ZenQuotes API
		const fetchQuote = async () => {
			try {
				loading.value = true;
				error.value = null;

				const response = await fetch("/api/zenquotes/random");
				if (!response.ok) {
					throw new Error("Failed to fetch quote");
				}

				const data = await response.json();
				if (data && data.length > 0) {
					quote.value = data[0].q;
					author.value = data[0].a;
				}
			} catch (err) {
				console.error("Error fetching quote:", err);
				error.value = "Failed to load quote";
			} finally {
				loading.value = false;
			}
		};

		onMounted(() => {
			fetchQuote();
		});

		return {
			quote,
			author,
			loading,
			error,
			fetchQuote,
		};
	},
};
</script>

<template>
	<div class="flex flex-col gap-4">
		<div>
			<h3 class="text-lg font-semibold text-brand-primary mb-1">Daily Inspiration</h3>
			<p class="text-sm text-brand-primary">Words of wisdom to keep you motivated</p>
		</div>
		<div v-if="loading" class="text-center py-8">
			<p class="text-sm text-brand-primary">Loading quote...</p>
		</div>
		<div v-else-if="error" class="text-center py-8">
			<p class="text-sm text-red-500">{{ error }}</p>
		</div>
		<div v-else-if="quote" class="flex flex-col gap-2">
			<blockquote class="text-brand-primary italic text-base leading-relaxed">
				"{{ quote }}"
			</blockquote>
			<footer class="text-sm text-brand-primary font-medium">
				- {{ author }}
			</footer>
		</div>
	</div>
</template>

