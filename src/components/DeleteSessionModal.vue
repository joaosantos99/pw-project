<script>
import Modal from "@/components/primitives/Modal.vue";
import Button from "@/components/primitives/Button.vue";
import { useStudySessions } from "@/composables/useStudySessions";
import { useToast } from "@/composables/useToast";

export default {
  name: "DeleteSessionModal",

  components: {
    Modal,
    Button,
  },

  data: () => ({
    isOpen: false,
    session: null,
    isDeleting: false,
  }),

  emits: ["close", "deleted"],

  methods: {
    open(session) {
      this.session = session;
      this.isOpen = true;
    },
    close() {
      if (this.isDeleting) {
        return;
      }
      this.isOpen = false;
      this.session = null;
      this.$emit("close");
    },
    handleClose() {
      this.close();
    },
    handleCancel() {
      this.handleClose();
    },
    async handleConfirm() {
      if (!this.session || this.isDeleting) {
        return;
      }

      this.isDeleting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { deleteStudySession } = useStudySessions();
        await deleteStudySession(this.session.id);
        showSuccess("Session deleted successfully!");
        this.$emit("deleted");
        this.close();
      } catch (error) {
        console.error("Error deleting session:", error);
        showError(error.message || "Failed to delete session. Please try again.");
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<template>
  <Modal
    v-if="isOpen && session"
    title="Delete Session"
    description="Are you sure you want to delete this session? This action cannot be undone."
    @close="handleClose"
  >
    <div class="flex flex-col gap-4">
      <p class="text-sm text-red-500">
        You are about to delete a session from <strong>{{ session.date }}</strong>
      </p>
      <div class="flex justify-end gap-4 mt-2">
        <Button variant="outline" @click="handleCancel" :disabled="isDeleting">
          Cancel
        </Button>
        <Button variant="danger" @click="handleConfirm" :disabled="isDeleting">
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
