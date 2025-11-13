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
  <div class="bg-brand-white border border-brand-primary p-6">
    <div class="mb-6" v-if="title || subtitle">
      <h3 class="text-lg font-bold" v-if="title">{{ title }}</h3>
      <p class="text-sm" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
