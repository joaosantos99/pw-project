<script>
import ContentHeader from '../components/ContentHeader.vue'
import Button from '../components/Button.vue'
export default {
  name: 'TimerView',

  components: {
    ContentHeader,
    Button,
  },
}
</script>

<template>
  <ContentHeader
    title="Study Timer"
    paragraph="Focus on your studies with the Pomodoro technique"
  />
</template>
