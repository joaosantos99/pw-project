<script>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { useGoals } from "@/composables/useGoals";

export default {
	name: "TodayProgress",

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();
		const { getGoals } = useGoals();

		const todayHours = ref(0);
		const dailyGoal = ref(4);

		// Parse duration string to hours
		const parseDurationToHours = (durationStr) => {
			if (!durationStr) return 0;

			let totalMinutes = 0;
			const hourMatch = durationStr.match(/(\d+)h/);
			const minuteMatch = durationStr.match(/(\d+)m/);
			const secondMatch = durationStr.match(/(\d+)s/);

			if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
			if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
			if (secondMatch) totalMinutes += parseInt(secondMatch[1]) / 60;

			return totalMinutes / 60;
		};

		// Normalize date to YYYY-MM-DD format
		const normalizeDate = (date) => {
			const d = new Date(date);
			if (isNaN(d.getTime())) return null;
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		// Calculate today's progress
		const calculateTodayProgress = async () => {
			if (!authStore.auth?.user?.id) {
				todayHours.value = 0;
				return;
			}

			try {
				// Get today's date
				const today = new Date();
				const todayNormalized = normalizeDate(today);

				// Get daily goal
				const goals = await getGoals(authStore.auth.user.id, "daily");
				const hoursGoal = goals.find((g) => g.unit === "hours");
				if (hoursGoal) {
					dailyGoal.value = hoursGoal.value;
				}

				// Get today's sessions
				const sessions = await getStudySessions(authStore.auth.user.id);
				let totalHours = 0;

				sessions.forEach((session) => {
					if (session.date) {
						const sessionDate = normalizeDate(session.date);
						if (sessionDate === todayNormalized) {
							totalHours += parseDurationToHours(session.duration);
						}
					}
				});

				todayHours.value = totalHours;
			} catch (error) {
				console.error("Error calculating today's progress:", error);
			}
		};

		const progressPercentage = computed(() => {
			if (dailyGoal.value === 0) return 0;
			return Math.min((todayHours.value / dailyGoal.value) * 100, 100);
		});

		const circumference = computed(() => 2 * Math.PI * 80);

		onMounted(() => {
			calculateTodayProgress();
		});

		return {
			todayHours,
			dailyGoal,
			progressPercentage,
			circumference,
		};
	},
};
</script>

<template>
	<div class="flex flex-col items-center gap-4">
		<div class="text-center">
			<h3 class="text-lg font-semibold text-brand-primary mb-2">Today's Progress</h3>
			<p class="text-sm text-brand-primary">
				{{ todayHours.toFixed(1) }} / {{ dailyGoal }} hours completed
			</p>
		</div>
		<div class="relative flex items-center justify-center">
			<svg class="transform -rotate-90" width="200" height="200">
				<!-- Background circle -->
				<circle
					cx="100"
					cy="100"
					r="80"
					fill="none"
					stroke="#e5e5da"
					stroke-width="12"
				/>
				<!-- Progress circle -->
				<circle
					cx="100"
					cy="100"
					r="80"
					fill="none"
					stroke="#3e43f0"
					stroke-width="12"
					class="transition-all duration-300"
					:stroke-dasharray="circumference"
					:stroke-dashoffset="circumference * (1 - progressPercentage / 100)"
					stroke-linecap="round"
				/>
			</svg>
			<div class="absolute flex flex-col items-center justify-center">
				<div class="text-4xl font-bold text-brand-primary">{{ Math.round(progressPercentage) }}%</div>
				<div class="text-sm text-brand-primary mt-1">Complete</div>
			</div>
		</div>
	</div>
</template>

