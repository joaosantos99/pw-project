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
			required: false,
		},
		subtitle: {
			type: String,
			required: false,
		},
		actions: {
			type: Array,
			required: false,
			default: () => [],
		},
	},
};
</script>

<template>
  <div class="bg-brand-white border border-brand-primary p-6">
    <div class="mb-6" v-if="title || subtitle || icon || actions.length > 0">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <component :is="icon" size="22" v-if="icon"/>
          <h3 class="text-lg font-semibold" v-if="title">{{ title }}</h3>
        </div>
        <div class="flex items-center gap-2" v-if="actions.length > 0">
          <button
            v-for="(action, index) in actions"
            :key="index"
            @click="action.onClick"
            :class="action.className || 'cursor-pointer text-brand-primary hover:opacity-70'"
          >
            <component :is="action.icon" :size="action.size || 18" />
          </button>
        </div>
      </div>
      <p class="text-sm font-light" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
