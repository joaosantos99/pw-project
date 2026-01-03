<script>
import { PencilIcon, Trash2Icon } from "lucide-vue-next";
import { useGoals } from "@/composables/useGoals";
import { useAuthStore } from "@/stores/auth";
import { GOALS_UNITS_LABELS } from "@/constants/goals";
import DeleteGoalModal from "@/components/DeleteGoalModal.vue";
import EditGoalModal from "@/components/EditGoalModal.vue";

export default {
  name: "GoalCards",

  components: {
    DeleteGoalModal,
    EditGoalModal,
  },

  props: {
    timePeriod: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    goals: [],
    isLoading: false,
    PencilIcon,
    Trash2Icon,
  }),

  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.auth?.user?.id;
    },
  },

  async mounted() {
    await this.fetchGoals();
  },

  watch: {
    timePeriod: {
      handler: "fetchGoals",
      immediate: false,
    },
  },

  methods: {
    async fetchGoals() {
      if (!this.userId) {
        return;
      }

      this.isLoading = true;
      try {
        const { getGoals } = useGoals();
        this.goals = await getGoals(this.userId, this.timePeriod);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        this.isLoading = false;
      }
    },
    calculateProgress(goal) {
      // TODO: Calculate actual progress from study sessions
      // For now, return a mock progress value
      const mockProgress = goal.value * 0.63;
      return {
        current: mockProgress,
        target: goal.value,
        percentage: Math.round((mockProgress / goal.value) * 100),
      };
    },
    formatProgress(goal, progress) {
      const unitLabel = GOALS_UNITS_LABELS[goal.unit] || goal.unit;
      return `${progress.current.toFixed(1)} / ${progress.target} ${unitLabel}`;
    },
    handleEdit(goal) {
      this.$refs.editGoalModal.open(goal);
    },
    async handleEditSuccess() {
      await this.fetchGoals();
    },
    handleDelete(goal) {
      this.$refs.deleteGoalModal.open(goal);
    },
    async handleDeleteSuccess() {
      await this.fetchGoals();
    },
  },
};
</script>

<template>
  <div v-if="isLoading" class="text-center py-8">Loading goals...</div>
  <div v-else-if="goals.length === 0" class="text-center py-8 text-gray-500">
    No goals found for this time period.
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card
      v-for="goal in goals"
      :key="goal.id"
      :title="goal.title"
      :actions="[
        {
          icon: PencilIcon,
          onClick: () => handleEdit(goal),
          className: 'cursor-pointer text-brand-primary hover:opacity-70',
        },
        {
          icon: Trash2Icon,
          onClick: () => handleDelete(goal),
          className: 'cursor-pointer text-red-500 hover:opacity-70',
        },
      ]"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-brand-primary">Progress</span>
          <span class="text-sm text-brand-primary">
            {{ formatProgress(goal, calculateProgress(goal)) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-brand-primary h-2 rounded-full transition-all"
            :style="{ width: `${calculateProgress(goal).percentage}%` }"
          ></div>
        </div>
        <div class="text-2xl font-bold text-brand-primary">
          {{ calculateProgress(goal).percentage }}%
        </div>
      </div>
    </Card>
  </div>
  <EditGoalModal
    ref="editGoalModal"
    @updated="handleEditSuccess"
  />
  <DeleteGoalModal
    ref="deleteGoalModal"
    @deleted="handleDeleteSuccess"
  />
</template>

