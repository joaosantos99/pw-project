<script>
import { PencilIcon, Trash2Icon } from "lucide-vue-next";
import { useGoals } from "@/composables/useGoals";
import { useAuthStore } from "@/stores/auth";
import { GOALS_UNITS_LABELS, GOALS_UNITS, GOALS_TABS } from "@/constants/goals";
import DeleteGoalModal from "@/components/DeleteGoalModal.vue";
import EditGoalModal from "@/components/EditGoalModal.vue";
import Card from "@/components/primitives/Card.vue";

export default {
  name: "GoalCards",

  components: {
    DeleteGoalModal,
    EditGoalModal,
    Card,
  },

  props: {
    timePeriod: {
      type: String,
      required: true,
    },
    studySessions: {
      type: Array,
      default: () => [],
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
    parseDate(dateStr) {
      if (!dateStr) return null;
      return new Date(dateStr);
    },
    parseDurationToHours(durationStr) {
      if (!durationStr) return 0;

      let totalMinutes = 0;
      const hourMatch = durationStr.match(/(\d+)h/);
      const minuteMatch = durationStr.match(/(\d+)m/);
      const secondMatch = durationStr.match(/(\d+)s/);

      if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
      if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
      if (secondMatch) totalMinutes += parseInt(secondMatch[1]) / 60;

      return totalMinutes / 60;
    },
    getSessionsForPeriod(timePeriod) {
      const now = new Date();
      let startDate;

      if (timePeriod === GOALS_TABS.DAILY) {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timePeriod === GOALS_TABS.WEEKLY) {
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek;
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (timePeriod === GOALS_TABS.MONTHLY) {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      return this.studySessions.filter(session => {
        const sessionDate = this.parseDate(session.date);
        if (!sessionDate) return false;
        return sessionDate >= startDate && sessionDate <= now;
      });
    },
    calculateProgress(goal) {
      const periodSessions = this.getSessionsForPeriod(this.timePeriod);
      let current = 0;

      if (goal.unit === GOALS_UNITS.HOURS) {
        current = periodSessions.reduce((sum, session) => {
          return sum + this.parseDurationToHours(session.duration);
        }, 0);
      } else if (goal.unit === GOALS_UNITS.SESSIONS) {
        current = periodSessions.length;
      }

      const percentage = goal.value > 0
        ? Math.min(100, Math.round((current / goal.value) * 100))
        : 0;

      return {
        current,
        target: goal.value,
        percentage,
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

