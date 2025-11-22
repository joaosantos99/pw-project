<script>
import { RouterLink } from "vue-router";

export default {
	name: "MenuItem",

	components: {
		RouterLink,
	},

	props: {
		icon: {
			type: Function,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
	},
};
</script>

<template>
  <RouterLink
    :class="[
      'flex gap-3 px-4 py-3 cursor-pointer',
      'hover:bg-brand-primary hover:text-brand-white transition-colors duration-150',
      { 'bg-brand-primary text-brand-white': isActive },
    ]"
    :to="to"
  >
    <component
      :is="icon"
      size="22"
    />
    <span :class="[{ 'text-brand-white': isActive }]">{{ label }}</span>
  </RouterLink>
</template>
