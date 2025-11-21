<script>
  import Button from '../components/primitives/Button.vue'
  import Card from '../components/primitives/Card.vue'
  import {
    ClockIcon,
  } from 'lucide-vue-next'
import { BUTTON_VARIANTS } from '../constants/buttons';
 
  export default {
    name: 'Subjects',

    data : () => ({
      ClockIcon,
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
  <Card :icon="ClockIcon" title="Quick Presets" subtitle="Choose a preset timer configuration!">
    <div class="flex justify-start gap-4">
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="" subtitle="25 min work, 5 min break">Classic</Button>
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="" subtitle="50 min work, 10 min break">Extended</Button> 
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="" subtitle="90 min work, 15 min break">Deep Work</Button>
      <Button :variant="BUTTON_VARIANTS.OUTLINE" @click="" subtitle="15 min work, 3 min break">Quick Session</Button>
    </div>
  </Card>
</template>
