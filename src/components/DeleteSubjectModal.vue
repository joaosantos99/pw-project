<script>
import Modal from "@/components/primitives/Modal.vue";
import Button from "@/components/primitives/Button.vue";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import { useSubjects } from "@/composables/useSubjects";
import { useToast } from "@/composables/useToast";

export default {
  name: "DeleteSubjectModal",

  components: {
    Modal,
    Button,
  },

  data: () => ({
    isOpen: false,
    subject: null,
    isDeleting: false,
    BUTTON_VARIANTS,
  }),

  emits: ["close", "deleted"],

  methods: {
    open(subject) {
      this.subject = subject;
      this.isOpen = true;
    },
    close() {
      if (this.isDeleting) {
        return;
      }
      this.isOpen = false;
      this.subject = null;
      this.$emit("close");
    },
    handleClose() {
      this.close();
    },
    handleCancel() {
      this.handleClose();
    },
    async handleConfirm() {
      if (!this.subject || this.isDeleting) {
        return;
      }

      this.isDeleting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { deleteSubject } = useSubjects();
        await deleteSubject(this.subject.id);
        showSuccess("Subject deleted successfully!");
        this.$emit("deleted");
        this.close();
      } catch (error) {
        console.error("Error deleting subject:", error);
        showError(error.message || "Failed to delete subject. Please try again.");
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<template>
  <Modal
    v-if="isOpen && subject"
    title="Delete Subject"
    description="Are you sure you want to delete this subject? This action cannot be undone."
    @close="handleClose"
  >
    <div class="flex flex-col gap-4">
      <p class="text-sm text-red-500">
        You are about to delete <strong>"{{ subject.name }}"</strong>
      </p>
      <div class="flex justify-end gap-4 mt-2">
        <Button :variant="BUTTON_VARIANTS.OUTLINE" :onClick="handleCancel" :disabled="isDeleting">
          Cancel
        </Button>
        <Button :variant="BUTTON_VARIANTS.DANGER" :onClick="handleConfirm" :disabled="isDeleting">
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

