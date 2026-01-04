<script>
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import AddSubjectModal from "@/components/AddSubjectModal.vue";
import EditSubjectModal from "@/components/EditSubjectModal.vue";
import DeleteSubjectModal from "@/components/DeleteSubjectModal.vue";
import Card from "@/components/primitives/Card.vue";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-vue-next";
import { useSubjects } from "@/composables/useSubjects";
import { useAuthStore } from "@/stores/auth";

export default {
	name: "SubjectsView",

	components: {
		ContentHeader,
		PageWrapper,
		AddSubjectModal,
		EditSubjectModal,
		DeleteSubjectModal,
		Card,
	},

	data: () => ({
		PlusIcon,
		PencilIcon,
		Trash2Icon,
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
		handleAddSubject() {
			this.$refs.addSubjectModal.open();
		},
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
		handleEdit(subject) {
			this.$refs.editSubjectModal.open(subject);
		},
		async handleEditSuccess() {
			await this.fetchSubjects();
		},
		handleDelete(subject) {
			this.$refs.deleteSubjectModal.open(subject);
		},
		async handleDeleteSuccess() {
			await this.fetchSubjects();
		},
		async handleAddSuccess() {
			await this.fetchSubjects();
		},
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Subjects"
      paragraph="Keep track of your subjects"
      buttonLabel="Add Subject"
      :buttonIcon="PlusIcon"
      :onClick="handleAddSubject"
    />
    <div class="flex flex-col gap-6">
      <Card title="Your Subjects" subtitle="Click on a subject to edit or delete it.">
        <div v-if="isLoading" class="text-center py-8">Loading subjects...</div>
        <div v-else-if="subjects.length === 0" class="text-center py-8 text-gray-500">
          No subjects found. Create your first subject!
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="subject in subjects"
            :key="subject.id"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 border border-brand-primary shrink-0"
                  :style="{ backgroundColor: subject.color || '#3e43f0' }"
                />
                <span class="text-lg font-semibold">{{ subject.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="handleEdit(subject)"
                  class="cursor-pointer text-brand-primary hover:opacity-70"
                >
                  <component :is="PencilIcon" size="18" />
                </button>
                <button
                  @click="handleDelete(subject)"
                  class="cursor-pointer text-red-500 hover:opacity-70"
                >
                  <component :is="Trash2Icon" size="18" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
    <AddSubjectModal ref="addSubjectModal" @created="handleAddSuccess" />
    <EditSubjectModal ref="editSubjectModal" @updated="handleEditSuccess" />
    <DeleteSubjectModal ref="deleteSubjectModal" @deleted="handleDeleteSuccess" />
  </PageWrapper>
</template>
