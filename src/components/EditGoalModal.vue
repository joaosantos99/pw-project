<script>
import {
  GOALS_TIME_PERIODS,
  GOALS_TIME_PERIODS_LABELS,
  GOALS_UNITS,
  GOALS_UNITS_LABELS,
} from "@/constants/goals";
import { useGoals } from "@/composables/useGoals";
import { useToast } from "@/composables/useToast";
import Modal from "@/components/primitives/Modal.vue";
import Button from "@/components/primitives/Button.vue";
import InputField from "@/components/primitives/InputField.vue";
import SelectField from "@/components/primitives/SelectField.vue";

export default {
  name: "EditGoalModal",

  components: {
    Modal,
    Button,
    InputField,
    SelectField,
  },

  data: () => ({
    isOpen: false,
    goal: null,
    formData: {
      title: "",
      timePeriod: "",
      unit: "",
      value: "",
    },
    isSubmitting: false,
  }),

  computed: {
    goalsTimePeriods: () => Object.values(GOALS_TIME_PERIODS).map(timePeriod => ({
      label: GOALS_TIME_PERIODS_LABELS[timePeriod],
      value: timePeriod,
    })),
    goalsUnits: () => Object.values(GOALS_UNITS).map(unit => ({
      label: GOALS_UNITS_LABELS[unit],
      value: unit,
    })),
  },

  methods: {
    open(goal) {
      this.goal = goal;
      this.formData = {
        title: goal.title,
        timePeriod: goal.time_period,
        unit: goal.unit,
        value: String(goal.value),
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
        title: "",
        timePeriod: "",
        unit: "",
        value: "",
      };
      this.goal = null;
    },
    async handleSubmit(event) {
      event.preventDefault();

      if (this.isSubmitting || !this.goal) {
        return;
      }

      this.isSubmitting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { updateGoal } = useGoals();
        await updateGoal(this.goal.id, {
          title: this.formData.title,
          timePeriod: this.formData.timePeriod,
          unit: this.formData.unit,
          value: Number(this.formData.value),
        });
        showSuccess("Goal updated successfully!");
        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Error updating goal:", error);
        showError(error.message || "Failed to update goal. Please try again.");
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
    title="Edit Goal"
    description="Update your study goal"
    @close="close"
  >
    <form class="flex flex-col gap-4" @submit="handleSubmit">
      <InputField
        id="goalTitle"
        name="goalTitle"
        label="Goal Title"
        placeholder="e.g., Daily Study Hours"
        type="text"
        v-model="formData.title"
      />
      <div class="grid grid-cols-2 gap-4">
        <SelectField
          id="goalTimePeriod"
          name="goalTimePeriod"
          label="Time Period"
          placeholder="Select Time Period"
          :options="goalsTimePeriods"
          v-model="formData.timePeriod"
        />
        <SelectField
          id="goalUnit"
          name="goalUnit"
          label="Unit"
          placeholder="Select Unit"
          :options="goalsUnits"
          v-model="formData.unit"
        />
      </div>
      <InputField
        id="goalValue"
        name="goalValue"
        label="Target"
        placeholder="Enter the goal target"
        type="number"
        v-model="formData.value"
      />
      <div class="flex justify-end gap-4 mt-2">
        <Button type="button" variant="outline" @click="handleCancel">Cancel</Button>
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Updating..." : "Update Goal" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

