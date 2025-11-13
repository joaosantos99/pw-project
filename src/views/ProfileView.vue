<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/Button.vue'
  export default {
    name: 'ProfileView',

    components: {
      ContentHeader,
      Button,
    },
  }
</script>

<template>
  <ContentHeader
    title="Profile & Settings"
    paragraph="Manage your account and preferences"
  />
</template>
