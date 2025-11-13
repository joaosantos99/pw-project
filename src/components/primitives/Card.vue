<script>
  export default {
    name: 'Card',

    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: false,
      },
    },
  }
</script>

<template>
  <div :class="['bg-brand-white border border-brand-primary p-6', $attrs.class]">
    <h3 class="text-lg font-bold">{{ title }}</h3>
    <p class="text-sm" v-if="subtitle">{{ subtitle }}</p>
    <div class="mt-6" v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
