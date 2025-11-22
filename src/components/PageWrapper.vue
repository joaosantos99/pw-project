<script>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { LAYOUTS } from "@/constants/layout";

export default {
	name: "PageWrapper",

	components: {
		Sidebar,
		Header,
	},

	data: () => ({
		LAYOUTS,
	}),

	props: {
		layout: {
			type: String,
			default: LAYOUTS.DEFAULT,
			validator: (value) => Object.values(LAYOUTS).includes(value),
		},
	},
};
</script>

<template>
  <div class="w-full flex">
    <Sidebar v-if="layout === LAYOUTS.DEFAULT" />
    <div class="w-full">
      <Header v-if="layout === LAYOUTS.DEFAULT" />
      <div
        :class="[
          layout === LAYOUTS.DEFAULT
          ? 'w-full flex flex-col gap-4 p-6'
          : 'w-full h-screen flex items-center justify-center',
        ]"
      >
        <slot />
    </div>
  </div>
</div>
</template>
