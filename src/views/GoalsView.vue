<script>
import { TargetIcon, CalendarIcon, TrendingUp } from "lucide-vue-next";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import AddGoalModal from "@/components/AddGoalModal.vue";
import GoalCards from "@/components/GoalCards.vue";
import {
  GOALS_TABS,
  GOALS_TABS_LABELS,
} from "@/constants/goals";

export default {
	name: "GoalsView",

	data: () => ({
		TargetIcon,
		CalendarIcon,
		TrendingUp,
    GOALS_TABS,
    GOALS_TABS_LABELS,
    activeTab: GOALS_TABS.DAILY,
	}),

	components: {
		ContentHeader,
		PageWrapper,
		AddGoalModal,
		GoalCards,
	},

  computed: {
    goalTabs: () => Object.values(GOALS_TABS).map(tab => ({
      label: GOALS_TABS_LABELS[tab],
      value: tab,
    })),
  },

  methods: {
    handleAddGoalClick() {
      this.$refs.addGoalModal.open();
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
      <div class="grid grid-cols-3 gap-6">
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Daily Progress</span>
            <component :is="TargetIcon" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">50%</div>
            <div class="text-sm font-light">1 of 2 goals completed</div>
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Weekly Progress</span>
            <component :is="TrendingUp" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">50%</div>
            <div class="text-sm font-light">1 of 2 goals completed</div>
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between mb-6">
            <span>Monthly Progress</span>
            <component :is="CalendarIcon" size="22"/>
          </div>
          <div>
            <div class="text-2xl font-semibold">50%</div>
            <div class="text-sm font-light">1 of 2 goals completed</div>
          </div>
        </Card>
      </div>
      <div class="flex flex-col gap-6">
        <Tabs :tabs="goalTabs" :activeTab="activeTab" @tab-click="handleTabClick" />
        <GoalCards :timePeriod="activeTab" />
      </div>
    </div>
    <AddGoalModal ref="addGoalModal" />
  </PageWrapper>
</template>
