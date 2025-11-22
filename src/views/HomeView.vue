<script>
import { PlayIcon } from "lucide-vue-next";
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";

export default {
	name: "HomeView",

	data: () => ({
		PlayIcon,
	}),

	components: {
		ContentHeader,
		PageWrapper,
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
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
