<script>
import {
	BookMarkedIcon,
	BookOpenIcon,
	LayoutDashboardIcon,
	TargetIcon,
	TimerIcon,
	UserIcon,
} from "lucide-vue-next";

import MenuItem from "@/components/MenuItem.vue";

export default {
	name: "Sidebar",

	components: {
		MenuItem,
	},

	data() {
		return {
			LayoutDashboardIcon,
			TimerIcon,
			TargetIcon,
			BookMarkedIcon,
			BookOpenIcon,
			UserIcon,
			menuItems: [
				{
					icon: LayoutDashboardIcon,
					label: "Home",
					to: "/",
				},
				{
					icon: TimerIcon,
					label: "Timer",
					to: "/timer",
				},
				{
					icon: TargetIcon,
					label: "Goals",
					to: "/goals",
				},
				{
					icon: BookMarkedIcon,
					label: "Subjects",
					to: "/subjects",
				},
				{
					icon: BookOpenIcon,
					label: "Sessions",
					to: "/sessions",
				},
				{
					icon: UserIcon,
					label: "Profile",
					to: "/profile",
				},
			],
		};
	},

	computed: {
		menuItemsWithActiveState() {
			return this.menuItems.map((item) => ({
				...item,
				isActive: this.isActivePath(item.to),
			}));
		},
	},

	methods: {
		isActivePath(path) {
			if (path === "/") {
				return this.$route.fullPath === "/";
			}

			return this.$route.fullPath.includes(path);
		},
	},
};
</script>

<template>
  <aside class="max-w-[280px] w-full h-screen">
    <div class="h-full position-fixed border-r border-brand-primary flex flex-col justify-between p-6">
      <div class="flex flex-col gap-6">
        <section>
          <img src="../assets/logo.svg" alt="logo" class="w-full h-full object-contain" />
        </section>
        <section class="flex flex-col gap-2">
          <MenuItem
            v-for="item in menuItemsWithActiveState"
            :key="item.label"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :is-active="item.isActive"
          />
        </section>
      </div>
      <section class="border-t border-brand-primary">
        <p class="text-xs text-center pt-4">Track your learning journey!</p>
      </section>
    </div>
  </aside>
</template>
