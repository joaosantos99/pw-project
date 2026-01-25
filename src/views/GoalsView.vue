<script>
import { TargetIcon, CalendarIcon, TrendingUp } from "lucide-vue-next";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import AddGoalModal from "@/components/AddGoalModal.vue";
import GoalCards from "@/components/GoalCards.vue";
import Card from "@/components/primitives/Card.vue";
import Tabs from "@/components/primitives/Tabs.vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { useGoals } from "@/composables/useGoals";
import {
  GOALS_TABS,
  GOALS_TABS_LABELS,
  GOALS_UNITS,
} from "@/constants/goals";
import { parseDurationToHours } from "@/utils/dates";

export default {
	name: "GoalsView",

	data: () => ({
		TargetIcon,
		CalendarIcon,
		TrendingUp,
    GOALS_TABS,
    GOALS_TABS_LABELS,
    activeTab: GOALS_TABS.DAILY,
    studySessions: [],
    goals: [],
    isLoading: false,
	}),

	components: {
		ContentHeader,
		PageWrapper,
		AddGoalModal,
		GoalCards,
		Card,
		Tabs,
	},

  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.auth?.user?.id;
    },
    goalTabs: () => Object.values(GOALS_TABS).map(tab => ({
      label: GOALS_TABS_LABELS[tab],
      value: tab,
    })),
    dailyProgress() {
      return this.calculateProgressForPeriod(GOALS_TABS.DAILY);
    },
    weeklyProgress() {
      return this.calculateProgressForPeriod(GOALS_TABS.WEEKLY);
    },
    monthlyProgress() {
      return this.calculateProgressForPeriod(GOALS_TABS.MONTHLY);
    },
  },

  async mounted() {
    await this.fetchData();
  },

  methods: {
    async fetchData() {
      if (!this.userId) return;

      this.isLoading = true;
      try {
        const { getStudySessions } = useStudySessions();
        const { getGoals } = useGoals();

        const [sessions, allGoals] = await Promise.all([
          getStudySessions(this.userId),
          Promise.all([
            getGoals(this.userId, GOALS_TABS.DAILY),
            getGoals(this.userId, GOALS_TABS.WEEKLY),
            getGoals(this.userId, GOALS_TABS.MONTHLY),
          ]),
        ]);

        this.studySessions = sessions;
        this.goals = allGoals.flat();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    parseDate(dateStr) {
      if (!dateStr) return null;
      return new Date(dateStr);
    },
    parseDurationToHours,
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
    calculateProgressForPeriod(timePeriod) {
      const periodGoals = this.goals.filter(goal => goal.time_period === timePeriod);
      if (periodGoals.length === 0) {
        return { percentage: 0, completed: 0, total: 0 };
      }

      const periodSessions = this.getSessionsForPeriod(timePeriod);
      let completedGoals = 0;

      periodGoals.forEach(goal => {
        let progress = 0;

        if (goal.unit === GOALS_UNITS.HOURS) {
          const totalHours = periodSessions.reduce((sum, session) => {
            return sum + this.parseDurationToHours(session.duration);
          }, 0);
          progress = totalHours;
        } else if (goal.unit === GOALS_UNITS.SESSIONS) {
          progress = periodSessions.length;
        }

        if (progress >= goal.value) {
          completedGoals++;
        }
      });

      const percentage = Math.round((completedGoals / periodGoals.length) * 100);
      return {
        percentage,
        completed: completedGoals,
        total: periodGoals.length,
      };
    },
    handleAddGoalClick() {
      this.$refs.addGoalModal.open();
    },
    async handleAddGoalSuccess() {
      await this.fetchData();
    },
    handleTabClick(tabValue) {
      this.activeTab = tabValue;
    },
  },
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Goals"
      paragraph="Set and track your study goals"
      buttonLabel="Add Goals"
      :buttonIcon="TargetIcon"
      :onClick="handleAddGoalClick"
    />
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Daily Progress</span>
            <component :is="TargetIcon" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">{{ dailyProgress.percentage }}%</div>
            <div class="text-sm font-light">{{ dailyProgress.completed }} of {{ dailyProgress.total }} goals completed</div>
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Weekly Progress</span>
            <component :is="TrendingUp" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">{{ weeklyProgress.percentage }}%</div>
            <div class="text-sm font-light">{{ weeklyProgress.completed }} of {{ weeklyProgress.total }} goals completed</div>
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Monthly Progress</span>
            <component :is="CalendarIcon" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">{{ monthlyProgress.percentage }}%</div>
            <div class="text-sm font-light">{{ monthlyProgress.completed }} of {{ monthlyProgress.total }} goals completed</div>
          </div>
        </Card>
      </div>
      <div class="flex flex-col gap-6">
        <Tabs :tabs="goalTabs" :activeTab="activeTab" @tab-click="handleTabClick" />
        <GoalCards :timePeriod="activeTab" :studySessions="studySessions" />
      </div>
    </div>
    <AddGoalModal ref="addGoalModal" @created="handleAddGoalSuccess" />
  </PageWrapper>
</template>
