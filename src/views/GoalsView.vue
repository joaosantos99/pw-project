<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'
  import {
      TargetIcon,
    } from 'lucide-vue-next'

  export default {
    name: 'GoalsView',

    data: () => ({
      TargetIcon,
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
      title="Goals"
      paragraph="Set and track your study goals"
      buttonLabel="Add Goals"
      :buttonIcon="TargetIcon"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
