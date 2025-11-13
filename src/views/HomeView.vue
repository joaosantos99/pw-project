<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/Button.vue'
  import {
    PlayIcon
  } from 'lucide-vue-next'

  export default {
    name: 'HomeView',

    data: () => ({
      PlayIcon,
    }),

    components: {
      ContentHeader,
      Button,
    },
  }
</script>

<template>
  <ContentHeader
    title="Dashboard"
    paragraph="Track your study progress and stay motivated"
    buttonLabel="Start Study Session"
    :buttonIcon="PlayIcon"
  />
</template>
