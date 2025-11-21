<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/primitives/Button.vue'
  import PageWrapper from '../components/PageWrapper.vue'

  export default {
    name: 'SubjectsView',

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
      title="Subjects"
      paragraph="Keep track of your subjects"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
