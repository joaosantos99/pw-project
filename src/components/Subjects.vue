<script>
  import Button from '../components/primitives/Button.vue'
  import Card from '../components/primitives/Card.vue'
  import {
    BookOpenIcon,
  } from 'lucide-vue-next'
import { BUTTON_VARIANTS } from '../constants/buttons';
 
  export default {
    name: 'Subjects',

    data : () => ({
      BookOpenIcon,
      BUTTON_VARIANTS,
    }),

    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: false,
      },
    },

    components: {
      Card,
      Button,
    },
  }
</script>

<template>
  <Card :icon="BookOpenIcon" title="Subjects" subtitle="What are you studying?">
    <div class="flex justify-start gap-4">
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="">Maths</Button>
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="">English</Button>
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="">Physics</Button>
      <Button class="font-light":variant="BUTTON_VARIANTS.OUTLINE" @click="">Arts</Button>
    </div>
  </Card>
</template>
