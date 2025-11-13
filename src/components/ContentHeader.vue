<script>
  import Button from '../components/Button.vue'
  import { BUTTON_VARIANTS } from '../constants/buttons'
  
  export default {
    name: 'ContentHeader',

    components: {
      Button,
    },

    data: () => ({
      BUTTON_VARIANTS,
    }),

    props: {
      title: {
        type: String,
        required: true
      },
      paragraph: {
        type: String,
        required: false
      },
      buttonLabel: {
        type: String,
      },
      buttonIcon: {
        type: Function,
        required: false
    }
  }
}
</script>

<template>
  <div class="w-full h-fit flex items-start justify-between p-6">
    <div class="flex flex-col">
      <h1>{{ title }}</h1>
      <h2>{{ paragraph }}</h2>
    </div>
    <div v-if="buttonLabel">
      <Button :icon="buttonIcon" :variant="BUTTON_VARIANTS.PRIMARY" @click="">{{ buttonLabel }}</Button>
    </div>
  </div>
</template>