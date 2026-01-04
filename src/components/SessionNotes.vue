<script>
import { mapWritableState } from "pinia";
import { useTimerStore } from "@/stores/timerStore";
import { FileTextIcon, SaveIcon } from "lucide-vue-next";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";

export default {
	name: "SessionNotes",

	components: {
		Card,
		Button,
	},

	data: () => ({
		FileTextIcon,
		SaveIcon,
		BUTTON_VARIANTS,
	}),

	computed: {
		...mapWritableState(useTimerStore, ["notes"]),
	},

	methods: {
		async handleSaveSession() {
			const timerStore = useTimerStore();
			try {
				await timerStore.saveSession();
				alert("Session saved successfully!");
			} catch (error) {
				console.error("Failed to save session:", error);
				alert(`Failed to save session: ${error.message || "Please try again."}`);
			}
		},
	},
};
</script>

<template>
  <Card :icon="FileTextIcon" title="Session Notes" subtitle="Reflect on what you've learned!">
    <div class="flex justify-start gap-4">
      <textarea
        v-model="notes"
        placeholder="Add your notes here..."
        rows="3"
        class="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
      />
      <Button :icon="SaveIcon" :variant="BUTTON_VARIANTS.PRIMARY" :onClick="handleSaveSession">Save Session</Button>
    </div>
  </Card>
</template>
