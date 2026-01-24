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

	data() {
		return {
			isMenuOpen: false
		}
	},

	computed: {
		shouldShowLayout() {
			const authRoutes = ["/login", "/signup"];
			return !authRoutes.includes(this.$route.path);
		},
	},

	mounted() {
		const { checkSession } = useAuth();
		checkSession();
	},

	watch: {
		'$route'() {
			this.isMenuOpen = false;
		}
	},
};
</script>

<template>
  <div v-if="shouldShowLayout" class="w-full flex">
    <Sidebar :is-open="isMenuOpen" @close="isMenuOpen = false"/>
    <div class="w-full">
      <Header @show-menu="isMenuOpen = true"/>
      <div class="w-full flex flex-col gap-4 p-6 pt-[104px]">
        <RouterView />
      </div>
    </div>
  </div>
  <RouterView v-else />
</template>
