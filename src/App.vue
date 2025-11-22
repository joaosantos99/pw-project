<script>
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useAuth } from "@/composables/useAuth";

export default {
	name: "App",
	components: {
		Header,
		Sidebar,
		RouterView,
	},

	setup() {
		const { checkSession } = useAuth();

		return {
			checkSession,
		};
	},
};
</script>

<template>
  <RouterView />
</template>
