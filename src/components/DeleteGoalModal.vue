<script>
import Modal from "@/components/primitives/Modal.vue";
import Button from "@/components/primitives/Button.vue";
import { useGoals } from "@/composables/useGoals";

export default {
  name: "DeleteGoalModal",

  components: {
    Modal,
    Button,
  },

  data: () => ({
    isOpen: false,
    goal: null,
    isDeleting: false,
  }),

  emits: ["close", "deleted"],

  methods: {
    open(goal) {
      this.goal = goal;
      this.isOpen = true;
    },
    close() {
      if (this.isDeleting) {
        return;
      }
      this.isOpen = false;
      this.goal = null;
      this.$emit("close");
    },
    handleClose() {
      this.close();
    },
    handleCancel() {
      this.handleClose();
    },
    async handleConfirm() {
      if (!this.goal || this.isDeleting) {
        return;
      }

      this.isDeleting = true;

      try {
        const { deleteGoal } = useGoals();
        await deleteGoal(this.goal.id);
        this.$emit("deleted");
        this.close();
      } catch (error) {
        console.error("Error deleting goal:", error);
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<template>
  <Modal
    v-if="isOpen && goal"
    title="Delete Goal"
    description="Are you sure you want to delete this goal? This action cannot be undone."
    @close="handleClose"
  >
    <div class="flex flex-col gap-4">
      <p class="text-sm text-red-500">
        You are about to delete <strong>"{{ goal.title }}"</strong>
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

