<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'

  export default {
    name: 'SessionsView',

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
      title="Study Sessions"
      paragraph="View and manage your study sessions"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
