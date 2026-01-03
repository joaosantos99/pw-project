<script>
import { PlayIcon } from "lucide-vue-next";
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import Card from "@/components/primitives/Card.vue";
import PieChart from "@/components/charts/PieChart.vue";

export default {
	name: "HomeView",

	data: () => ({
		PlayIcon,
	}),

	components: {
		ContentHeader,
		PageWrapper,
		Card,
		PieChart,
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
    <div class="flex flex-col gap-6">
      <Card>
        <PieChart />
      </Card>
    </div>
  </PageWrapper>
</template>
