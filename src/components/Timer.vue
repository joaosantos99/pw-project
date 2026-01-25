<script>
import { mapState } from "pinia";
import { useTimerStore } from "@/stores/timerStore";
import { PlayIcon, PauseIcon, RotateCcwIcon, Volume2Icon, VolumeXIcon } from "lucide-vue-next";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";

export default {
	name: "Timer",

	components: {
		Card,
		Button,
	},

	data: () => ({
		PlayIcon,
		PauseIcon,
		RotateCcwIcon,
		Volume2Icon,
		VolumeXIcon,
		updateInterval: null,
		currentTime: Date.now(),
		timerStore: null,
	}),

	computed: {
		...mapState(useTimerStore, [
			"status",
			"isRunning",
			"isMuted",
		]),

	formattedTime() {
		const timerStore = this.timerStore || useTimerStore();
		this.currentTime;
		return timerStore.formattedTime;
	},

	progress() {
		const timerStore = this.timerStore || useTimerStore();
		this.currentTime;
		return timerStore.progress;
	},
	},

	watch: {
		progress(newProgress) {
			// Play sound when target is reached (progress >= 1)
			if (newProgress >= 1 && this.isRunning && !this.isMuted) {
				this.playNotificationSound();
			}
		},
	},

	created() {
		this.timerStore = useTimerStore();
	},

	mounted() {
		this.updateInterval = setInterval(() => {
			this.currentTime = Date.now();
			this.timerStore.updateTimestamp();
		}, 1000);
	},

	beforeUnmount() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
		}
	},

	methods: {
		handleToggleTimer() {
			this.timerStore.toggleTimer();
		},

		handleReset() {
			this.timerStore.resetTimer();
		},

		handleToggleMute() {
			this.timerStore.toggleMute();
		},

		async handleSaveSession() {
			try {
				await this.timerStore.saveSession();
			} catch (error) {
				console.error("Failed to save session:", error);
			}
		},

		playNotificationSound() {
			// Create a simple beep sound using Web Audio API
			try {
				const audioContext = new (window.AudioContext || window.webkitAudioContext)();
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				oscillator.frequency.value = 800;
				oscillator.type = "sine";

				gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.5);
			} catch (error) {
				console.log("Audio notification failed, using browser notification");
			}
		},
	},
};
</script>

<template>
  <Card title="Pomodoro Timer" subtitle="Stay focused and take regular breaks">
    <div class="flex flex-col items-center gap-6">
      <!-- Circular Timer -->
      <div class="relative flex items-center justify-center" role="timer" :aria-label="`Timer: ${formattedTime}, ${status}`">
        <svg class="transform -rotate-90" width="240" height="240" aria-hidden="true">
          <!-- Background circle -->
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-gray-200"
          />
          <!-- Progress circle -->
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-brand-primary transition-all duration-300"
            :stroke-dasharray="2 * Math.PI * 110"
            :stroke-dashoffset="2 * Math.PI * 110 * (1 - progress)"
            stroke-linecap="round"
          />
        </svg>
        <div class="absolute flex flex-col items-center justify-center">
          <div class="text-6xl font-bold text-brand-primary" aria-live="polite" aria-atomic="true">{{ formattedTime }}</div>
          <div class="text-sm text-brand-primary mt-2" aria-live="polite">{{ status }}</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-2">
        <Button
          :icon="isRunning ? PauseIcon : PlayIcon"
          variant="primary"
          class="px-8"
          :onClick="handleToggleTimer"
          :aria-label="isRunning ? 'Pause timer' : 'Start timer'"
        >
          {{ isRunning ? "Pause" : "Start" }}
        </Button>
        <Button
          :icon="RotateCcwIcon"
          variant="outline"
          class="px-8"
          :onClick="handleReset"
          aria-label="Reset timer"
        >
          Reset
        </Button>
        <button
          class="p-2 text-brand-primary hover:opacity-70 cursor-pointer"
          @click="handleToggleMute"
          :aria-label="isMuted ? 'Unmute notifications' : 'Mute notifications'"
          :aria-pressed="isMuted"
        >
          <component :is="isMuted ? VolumeXIcon : Volume2Icon" size="22" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Card>
</template>