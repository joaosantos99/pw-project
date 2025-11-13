<script>
  import Sidebar from './Sidebar.vue'
  import { LAYOUTS } from '../constants/layout'

  export default {
    name: 'PageWrapper',

    components: {
      Sidebar,
    },

    data: () => ({
      LAYOUTS,
    }),

    props: {
      layout: {
        type: String,
        default: LAYOUTS.DEFAULT,
        validator: (value) => Object.values(LAYOUTS).includes(value),
      }
    }
  }
</script>

<template>
  <div class="w-full flex">
    <Sidebar v-if="layout === LAYOUTS.DEFAULT" />
    <div
    :class="[
      layout === LAYOUTS.DEFAULT
      ? 'w-full flex flex-col gap-4 p-6'
      : 'w-full h-screen flex items-center justify-center',
    ]">
    <slot />
  </div>
</div>
</template>
