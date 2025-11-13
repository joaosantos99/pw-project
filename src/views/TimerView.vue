<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'

  export default {
    name: 'TimerView',

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
    title="Study Timer"
    paragraph="Focus on your studies with the Pomodoro technique"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
