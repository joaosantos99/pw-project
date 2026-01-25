<script>
import {
	BookMarkedIcon,
	BookOpenIcon,
	LayoutDashboardIcon,
	TargetIcon,
	TimerIcon,
	UserIcon,
	UsersIcon,
	X
} from "lucide-vue-next";

import MenuItem from "@/components/MenuItem.vue";
import { useAuthStore } from "@/stores/auth";

export default {
	name: "Sidebar",

	components: {
		MenuItem,
		X
	},

	data() {
		return {
			LayoutDashboardIcon,
			TimerIcon,
			TargetIcon,
			BookMarkedIcon,
			BookOpenIcon,
			UserIcon,
			UsersIcon,
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

	props: {
		isOpen:  {
			type: Boolean,
			default: false
		}
	},

	computed: {
		isAdmin() {
			const authStore = useAuthStore();
			return authStore.auth?.user?.isAdmin === true;
		},
		menuItemsWithActiveState() {
			const items = this.menuItems.map((item) => ({
				...item,
				isActive: this.isActivePath(item.to),
			}));

			if (this.isAdmin) {
				items.splice(items.length - 1, 0, {
					icon: UsersIcon,
					label: "Users",
					to: "/users",
					isActive: this.isActivePath("/users"),
				});
			}

			return items;
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
  <aside :class="['lg:max-w-[280px] lg:block lg:w-full h-screen', isOpen ? 'w-full fixed inset-0 z-50' : 'hidden']">
	<div class="h-full w-full lg:max-w-[280px] lg:border-r bg-brand-white border-brand-primary flex flex-col justify-between p-6">
		<div class="flex flex-col gap-6">
			<section class="flex items-center justify-between">
				<img src="../assets/logo.svg" alt="Study Tracker logo" class="w-60 h-full object-contain" />
				<button
					v-if="isOpen"
					@click="$emit('close')"
					class="lg:hidden cursor-pointer text-brand-primary"
					aria-label="Close navigation menu"
				>
					<X aria-hidden="true" />
				</button>
        	</section>
			<nav class="flex flex-col gap-2" aria-label="Main navigation">
			<MenuItem
				v-for="item in menuItemsWithActiveState"
				:key="item.label"
				:icon="item.icon"
				:label="item.label"
				:to="item.to"
				:is-active="item.isActive"
			/>
			</nav>
		</div>
		<section class="border-t border-brand-primary">
			<p class="text-xs text-center pt-4">Track your learning journey!</p>
		</section>
    </div>
  </aside>
</template>
