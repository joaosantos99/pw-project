<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/Button.vue'
  export default {
    name: 'SessionsView',

    components: {
      ContentHeader,
      Button,
    },
  }
</script>

<template>
  <ContentHeader
    title="Study Sessions"
    paragraph="View and manage your study sessions"
  />
</template>
