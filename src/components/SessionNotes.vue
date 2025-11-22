<script>
  import Button from '../components/primitives/Button.vue'
  import Card from '../components/primitives/Card.vue'
  import {
    FileTextIcon,
    SaveIcon,
  } from 'lucide-vue-next'
import { BUTTON_VARIANTS } from '../constants/buttons';
 
  export default {
    name: 'SessionNotes',

    data : () => ({
      FileTextIcon,
      SaveIcon,
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
  <Card :icon="FileTextIcon" title="Session Notes" subtitle="Reflect on what you've learned!">
    <div class="flex justify-start gap-4">
      <input
        type="text"
        placeholder="Add your notes here..."
        class="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
      <Button :icon="SaveIcon" :variant="BUTTON_VARIANTS.PRIMARY" @click="">Save</Button>
    </div>
  </Card>
</template>
