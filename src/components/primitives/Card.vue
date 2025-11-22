<script>
export default {
	name: "Card",

	props: {
		icon: {
			type: Function,
			required: false,
		},
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: false,
		},
	},
};
</script>

<template>
  <div class="bg-brand-white border border-brand-primary p-6">
    <div class="mb-6" v-if="title || subtitle">
      <div class="flex items-center gap-2">
        <component :is="icon" size="22"/>
        <h3 icon="" class="text-lg font-semibold" v-if="title">{{ title }}</h3>
      </div>
      <p class="text-sm font-light" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
