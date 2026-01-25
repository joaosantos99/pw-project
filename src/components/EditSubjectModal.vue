<script>
import Modal from "@/components/primitives/Modal.vue";
import InputField from "@/components/primitives/InputField.vue";
import Button from "@/components/primitives/Button.vue";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import { useSubjects } from "@/composables/useSubjects";
import { useToast } from "@/composables/useToast";

export default {
  name: "EditSubjectModal",

  components: {
    Modal,
    InputField,
    Button,
  },

  data: () => ({
    isOpen: false,
    subject: null,
    formData: {
      name: "",
      color: "#3e43f0",
    },
    isSubmitting: false,
    BUTTON_VARIANTS,
  }),

  methods: {
    open(subject) {
      this.subject = subject;
      this.formData = {
        name: subject.name,
        color: subject.color || "#3e43f0",
      };
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.resetForm();
    },
    handleCancel() {
      this.close();
    },
    resetForm() {
      this.formData = {
        name: "",
        color: "#3e43f0",
      };
      this.subject = null;
    },
    async handleSubmit(event) {
      event.preventDefault();

      if (this.isSubmitting || !this.subject) {
        return;
      }

      if (!this.formData.name || !this.formData.color) {
        return;
      }

      this.isSubmitting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { updateSubject } = useSubjects();
        await updateSubject(this.subject.id, {
          name: this.formData.name,
          color: this.formData.color,
        });
        showSuccess("Subject updated successfully!");
        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Error updating subject:", error);
        showError(error.message || "Failed to update subject. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<template>
  <Modal
    v-if="isOpen"
    title="Edit Subject"
    description="Update your subject details"
    @close="close"
  >
    <form class="flex flex-col gap-4" @submit="handleSubmit">
      <InputField
        id="subjectName"
        name="subjectName"
        label="Subject Name"
        placeholder="e.g., Biology, Physics, Art"
        type="text"
        v-model="formData.name"
      />
      <div class="flex flex-col gap-1">
        <label for="subjectColor" class="text-sm">Color</label>
        <div class="flex items-center gap-3">
          <input
            id="subjectColor"
            name="subjectColor"
            type="color"
            v-model="formData.color"
            class="w-12 h-12 border border-brand-primary cursor-pointer"
          />
          <input
            type="text"
            :value="formData.color"
            @input="formData.color = $event.target.value"
            class="flex-1 text-sm p-2 border border-brand-primary"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </div>
      <div class="flex justify-end gap-4 mt-2">
        <Button type="button" :variant="BUTTON_VARIANTS.OUTLINE" :onClick="handleCancel">Cancel</Button>
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Updating..." : "Update Subject" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

