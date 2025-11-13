<script>
  import ContentHeader from '../components/ContentHeader.vue'
  import Button from '../components/Button.vue'
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
  },
}
</script>

<template>
  <ContentHeader
    title="Goals"
    paragraph="Set and track your study goals"
    buttonLabel="Add Goals"
    :buttonIcon="TargetIcon"
  />
</template>
