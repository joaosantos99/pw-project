<script>
  import Sidebar from './components/sidebar.vue'
  import { RouterView } from 'vue-router'

  export default {
    name: 'App',
    components: {
      Sidebar,
      RouterView,
    },
  }
</script>

<template>
  <RouterView />
</template>
