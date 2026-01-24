<script>
import { ClockIcon } from "lucide-vue-next";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import {
	TIMES_PERSETS,
	TIMES_PERSETS_LABELS,
	TIMES_PRESETS_DESCRIPTIONS,
	TIMES_PERSETS_DURATION,
} from "@/constants/times";
import { useTimerStore } from "@/stores/timerStore";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";

export default {
	name: "QuickPresets",

	components: {
		Card,
		Button,
	},

	data: () => ({
		ClockIcon,
		BUTTON_VARIANTS,
		TIMES_PERSETS,
		TIMES_PERSETS_LABELS,
		TIMES_PRESETS_DESCRIPTIONS,
	}),

	computed: {
		timerStore() {
			return useTimerStore();
		},
		activePreset() {
			const targetDurationMinutes = this.timerStore.targetDuration / (60 * 1000);
			for (const [preset, duration] of Object.entries(TIMES_PERSETS_DURATION)) {
				if (duration === targetDurationMinutes) {
					return Number(preset);
				}
			}
			return null;
		},
	},

	methods: {
		handlePresetClick(preset) {
			this.timerStore.setPreset(preset);
		},
		isPresetActive(preset) {
			return this.activePreset === preset;
		},
	},
};
</script>

<template>
  <Card :icon="ClockIcon" title="Quick Presets" subtitle="Choose a preset timer configuration!">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
			<Button
				v-for="preset in Object.values(TIMES_PERSETS)"
				:key="preset"
				:variant="BUTTON_VARIANTS.OUTLINE"
				:onClick="() => handlePresetClick(preset)"
				:subtitle="TIMES_PRESETS_DESCRIPTIONS[preset]"
				:customClass="isPresetActive(preset) ? 'bg-brand-primary text-brand-white border-brand-primary' : ''"
			>
					{{ TIMES_PERSETS_LABELS[preset] }}
			</Button>
    </div>
  </Card>
</template>
