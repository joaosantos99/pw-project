<script>
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import QuickPresets from "@/components/QuickPresets.vue";
import SessionNotes from "@/components/SessionNotes.vue";
import Subjects from "@/components/Subjects.vue";
import Timer from "@/components/Timer.vue";

export default {
	name: "TimerView",

	components: {
		ContentHeader,
		PageWrapper,
		Timer,
		Subjects,
		QuickPresets,
		SessionNotes,
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Study Timer"
      paragraph="Focus on your studies with the Pomodoro technique"
    />
    <div class="flex flex-col gap-6">
      <Timer />
      <QuickPresets />
      <Subjects />
      <SessionNotes />
    </div>
  </PageWrapper>
</template>
