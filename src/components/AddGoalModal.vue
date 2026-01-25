<script>
import {
  GOALS_TIME_PERIODS,
  GOALS_TIME_PERIODS_LABELS,
  GOALS_UNITS,
  GOALS_UNITS_LABELS,
} from "@/constants/goals";
import { useGoals } from "@/composables/useGoals";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "AddGoalModal",

  data: () => ({
    isOpen: false,
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
    userId() {
      const authStore = useAuthStore();
      return authStore.auth?.user?.id;
    },
  },

  methods: {
    open() {
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
    },
    async handleSubmit(event) {
      event.preventDefault();

      if (this.isSubmitting || !this.userId) {
        return;
      }

      this.isSubmitting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { createGoal } = useGoals();
        await createGoal(this.userId, {
          title: this.formData.title,
          timePeriod: this.formData.timePeriod,
          unit: this.formData.unit,
          value: Number(this.formData.value),
        });
        showSuccess("Goal created successfully!");
        this.$emit("created");
        this.close();
      } catch (error) {
        console.error("Error creating goal:", error);
        showError(error.message || "Failed to create goal. Please try again.");
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
    title="Add New Goal"
    description="Set a new study goal to track your progress"
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
          {{ isSubmitting ? "Adding..." : "Add Goal" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

