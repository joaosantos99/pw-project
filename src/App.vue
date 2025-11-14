<script>
  import Header from './components/Header.vue'
  import Sidebar from './components/Sidebar.vue'
  import { RouterView } from 'vue-router'

  export default {
    name: 'App',
    components: {
      Header,
      Sidebar,
      RouterView,
    },
  }
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="w-full">
      <Header />
      <RouterView />
    </div>
  </div>
</template>
