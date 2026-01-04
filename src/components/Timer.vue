<script>
import { PlayIcon, RotateCcwIcon, Volume2Icon } from "lucide-vue-next";

export default {
	name: "Timer",

	data: () => ({
		PlayIcon,
		RotateCcwIcon,
		Volume2Icon,
		time: "25:00",
		status: "Ready to start",
	}),
};
</script>

<template>
  <Card title="Pomodoro Timer" subtitle="Stay focused and take regular breaks">
    <div class="flex flex-col items-center gap-6">
      <!-- Circular Timer -->
      <div class="relative flex items-center justify-center">
        <svg class="transform -rotate-90" width="240" height="240">
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-brand-primary"
          />
        </svg>
        <div class="absolute flex flex-col items-center justify-center">
          <div class="text-6xl font-bold text-brand-primary">{{ time }}</div>
          <div class="text-sm text-brand-primary mt-2">{{ status }}</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-2">
        <Button :icon="PlayIcon" variant="primary" class="px-8">Start</Button>
        <Button :icon="RotateCcwIcon" variant="outline" class="px-8">Reset</Button>
        <button class="p-2 text-brand-primary hover:opacity-70 cursor-pointer">
          <component :is="Volume2Icon" size="22" />
        </button>
      </div>
    </div>
  </Card>
</template>