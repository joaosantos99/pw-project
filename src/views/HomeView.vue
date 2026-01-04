<script>
import { PlayIcon } from "lucide-vue-next";
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import Card from "@/components/primitives/Card.vue";
import BarChart from "@/components/charts/BarChart.vue";
import TodayProgress from "@/components/TodayProgress.vue";
import LevelAchievements from "@/components/LevelAchievements.vue";
import QuickStats from "@/components/QuickStats.vue";
import Quotes from "@/components/Quotes.vue";

export default {
	name: "HomeView",

	data: () => ({
		PlayIcon,
	}),

	components: {
		ContentHeader,
		PageWrapper,
		Card,
		BarChart,
		TodayProgress,
		LevelAchievements,
		QuickStats,
		Quotes,
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Dashboard"
      paragraph="Track your study progress and stay motivated"
      buttonLabel="Start Study Session"
      :buttonIcon="PlayIcon"
    />
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card class="md:col-span-1">
        <TodayProgress />
      </Card>
      <Card class="md:col-span-3">
        <BarChart />
      </Card>
      <Card class="md:col-span-2">
        <LevelAchievements />
      </Card>
      <Card class="md:col-span-2">
        <QuickStats />
      </Card>
      <Card class="md:col-span-4">
        <Quotes />
      </Card>
    </div>
  </PageWrapper>
</template>
