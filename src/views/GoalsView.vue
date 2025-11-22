<script>
import { TargetIcon } from "lucide-vue-next";
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";

export default {
	name: "GoalsView",

	data: () => ({
		TargetIcon,
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
      title="Goals"
      paragraph="Set and track your study goals"
      buttonLabel="Add Goals"
      :buttonIcon="TargetIcon"
    />
    <div class="flex flex-col gap-6"></div>
  </PageWrapper>
</template>
