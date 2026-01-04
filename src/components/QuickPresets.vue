<script>
import { ClockIcon } from "lucide-vue-next";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import {
	TIMES_PERSETS,
	TIMES_PERSETS_LABELS,
	TIMES_PRESETS_DESCRIPTIONS,
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

	methods: {
		handlePresetClick(preset) {
			const timerStore = useTimerStore();
			timerStore.setPreset(preset);
		},
	},
};
</script>

<template>
  <Card :icon="ClockIcon" title="Quick Presets" subtitle="Choose a preset timer configuration!">
    <div class="flex justify-start gap-4">
			<Button
				v-for="preset in Object.values(TIMES_PERSETS)"
				:key="preset"
				:variant="BUTTON_VARIANTS.OUTLINE"
				:onClick="() => handlePresetClick(preset)"
				:subtitle="TIMES_PRESETS_DESCRIPTIONS[preset]"
			>
					{{ TIMES_PERSETS_LABELS[preset] }}
			</Button>
    </div>
  </Card>
</template>
