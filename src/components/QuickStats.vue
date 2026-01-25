<script>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { parseDurationToHours, parseDurationToMinutes } from "@/utils/dates";

export default {
	name: "QuickStats",

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();

		const totalSessions = ref(0);
		const totalHours = ref(0);
		const avgSessionMinutes = ref(0);

		// Calculate stats
		const calculateStats = async () => {
			if (!authStore.auth?.user?.id) {
				return;
			}

			try {
				const sessions = await getStudySessions(authStore.auth.user.id);
				totalSessions.value = sessions.length;

				let totalHoursValue = 0;
				let totalMinutesValue = 0;

				sessions.forEach((session) => {
					if (session.duration) {
						totalHoursValue += parseDurationToHours(session.duration);
						totalMinutesValue += parseDurationToMinutes(session.duration);
					}
				});

				totalHours.value = totalHoursValue;
				avgSessionMinutes.value =
					totalSessions.value > 0 ? Math.round(totalMinutesValue / totalSessions.value) : 0;
			} catch (error) {
				console.error("Error calculating stats:", error);
			}
		};

		onMounted(() => {
			calculateStats();
		});

		return {
			totalSessions,
			totalHours,
			avgSessionMinutes,
		};
	},
};
</script>

<template>
	<div class="flex flex-col gap-4">
		<div>
			<h3 class="text-lg font-semibold text-brand-primary mb-1">Quick Stats</h3>
			<p class="text-sm text-brand-primary">Your achievements</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex justify-between">
				<span class="text-sm text-brand-primary">Total Sessions</span>
				<span class="text-2xl font-bold text-brand-primary">{{ totalSessions }}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-brand-primary">Total Hours</span>
				<span class="text-2xl font-bold text-brand-primary">{{ totalHours.toFixed(1) }}h</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-brand-primary">Avg. Session</span>
				<span class="text-2xl font-bold text-brand-primary">{{ avgSessionMinutes }}min</span>
			</div>
		</div>
	</div>
</template>

