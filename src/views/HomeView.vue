<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'

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
      PageWrapper,
    },
  }
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Dashboard"
      paragraph="Track your study progress and stay motivated"
      buttonLabel="Start Study Session"
      :buttonIcon="PlayIcon"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
