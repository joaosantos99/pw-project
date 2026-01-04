<script>
import { LAYOUTS } from "@/constants/layout";

export default {
	name: "PageWrapper",

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
  <div
    :class="[
      layout === LAYOUTS.DEFAULT
      ? 'w-full flex flex-col gap-4'
      : 'w-full h-screen flex items-center justify-center',
    ]"
  >
    <slot />
  </div>
</template>
