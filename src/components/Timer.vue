<script>
  import Button from '../components/primitives/Button.vue'
  import Card from '../components/primitives/Card.vue'
  import {
    PlayIcon,
    RotateCcwIcon
  } from 'lucide-vue-next'
  
  export default {
    name: 'Timer',

    data: () => ({
      PlayIcon,
      RotateCcwIcon,
    }),

    components: {
      Button,
      Card,
    }
  }
</script>

<template>
  <Card title="Pomodoro Timer" subtitle="Stay focused and take regular breaks">
        <div class="flex justify-center">
          <Button :icon="PlayIcon" variant="primary" class="px-8 mx-2">Start</Button>
          <Button :icon="RotateCcwIcon" variant="outline" class="px-8 mx-2">Reset</Button>
        </div>
      </Card>
</template>