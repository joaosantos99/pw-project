<script>
import { ClockIcon } from "lucide-vue-next";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import {
	TIMES_PERSETS,
	TIMES_PERSETS_LABELS,
	TIMES_PRESETS_DESCRIPTIONS,
	TIMES_PRESETS_BREAK_DURATION,
} from "@/constants/times";

export default {
	name: "Subjects",

	data: () => ({
		ClockIcon,
		BUTTON_VARIANTS,
		TIMES_PERSETS,
		TIMES_PERSETS_LABELS,
		TIMES_PRESETS_DESCRIPTIONS,
		TIMES_PRESETS_BREAK_DURATION,
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
};
</script>

<template>
  <Card :icon="ClockIcon" title="Quick Presets" subtitle="Choose a preset timer configuration!">
    <div class="flex justify-start gap-4">
			<Button
				v-for="preset in TIMES_PERSETS"
				:key="preset" :variant="BUTTON_VARIANTS.OUTLINE"
				@click="" :subtitle="TIMES_PRESETS_DESCRIPTIONS[preset]"
			>
					{{ TIMES_PERSETS_LABELS[preset] }}
			</Button>
    </div>
  </Card>
</template>
