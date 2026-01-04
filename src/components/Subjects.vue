<script>
import { BookOpenIcon } from "lucide-vue-next";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";
import { useSubjects } from "@/composables/useSubjects";
import { useAuthStore } from "@/stores/auth";

export default {
	name: "Subjects",

	components: {
		Card,
		Button,
	},

	data: () => ({
		BookOpenIcon,
		BUTTON_VARIANTS,
		subjects: [],
		isLoading: false,
	}),

	computed: {
		userId() {
			const authStore = useAuthStore();
			return authStore.auth?.user?.id;
		},
	},

	async mounted() {
		await this.fetchSubjects();
	},

	methods: {
		async fetchSubjects() {
			if (!this.userId) {
				return;
			}

			this.isLoading = true;
			try {
				const { getSubjects } = useSubjects();
				this.subjects = await getSubjects(this.userId);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			} finally {
				this.isLoading = false;
			}
		},
	},

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
  <Card :icon="BookOpenIcon" title="Subjects" subtitle="What are you studying?">
    <div v-if="isLoading" class="text-center py-4">Loading subjects...</div>
    <div v-else-if="subjects.length === 0" class="text-center py-4 text-gray-500">
      No subjects found.
    </div>
    <div v-else class="flex justify-start gap-4 flex-wrap">
      <Button
        v-for="subject in subjects"
        :key="subject.id"
        :variant="BUTTON_VARIANTS.OUTLINE"
        @click=""
      >
        {{ subject.name }}
      </Button>
    </div>
  </Card>
</template>
