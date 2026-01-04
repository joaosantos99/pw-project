<script>
import { ref, onMounted } from "vue";
import { VisXYContainer, VisGroupedBar, VisAxis } from "@unovis/vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";

export default {
	name: "BarChart",

	components: {
		VisXYContainer,
		VisGroupedBar,
		VisAxis,
	},

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();

		// Get the current week starting from Monday
		const getCurrentWeek = () => {
			const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			const today = new Date();
			const dayOfWeek = today.getDay();

			// Calculate Monday of current week
			// If today is Sunday (0), go back 6 days; otherwise go back (dayOfWeek - 1) days
			const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
			const monday = new Date(today);
			monday.setDate(today.getDate() - daysFromMonday);
			monday.setHours(0, 0, 0, 0);

			// Get all 7 days of the week starting from Monday
			const weekDays = [];
			for (let i = 0; i < 7; i++) {
				const date = new Date(monday);
				date.setDate(monday.getDate() + i);
				weekDays.push({
					day: dayNames[i],
					date: date.toDateString(),
					hours: 0,
				});
			}

			return weekDays;
		};

		// Initialize with current week data - ensure it always has 7 days in correct order
		const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		const getInitialData = () => {
			return dayOrder.map((day, index) => ({
				day: day,
				dayIndex: index,
				hours: 0
			}));
		};
		const chartData = ref(getInitialData());

		// Parse duration string (e.g., "4m", "1h 30m", "45s") to hours
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

		// Normalize date to YYYY-MM-DD format for comparison
		const normalizeDate = (date) => {
			const d = new Date(date);
			if (isNaN(d.getTime())) return null;
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		// Process sessions and aggregate by day
		const processSessionsData = async () => {
			const currentWeek = getCurrentWeek();

			if (!authStore.auth?.user?.id) {
				chartData.value = getInitialData();
				return;
			}

			try {
				const sessions = await getStudySessions(authStore.auth.user.id);

				// Create a map of normalized date strings to hours, keyed by day name
				const hoursByDay = {};
				dayOrder.forEach((dayName) => {
					hoursByDay[dayName] = 0;
				});

				// Create a map of date to day name for current week
				const dateToDay = {};
				currentWeek.forEach((day) => {
					const normalizedDate = normalizeDate(day.date);
					if (normalizedDate) {
						dateToDay[normalizedDate] = day.day;
					}
				});

				// Aggregate hours from sessions
				sessions.forEach((session) => {
					if (session.date) {
						const sessionNormalizedDate = normalizeDate(session.date);
						if (sessionNormalizedDate && dateToDay[sessionNormalizedDate]) {
							const dayName = dateToDay[sessionNormalizedDate];
							hoursByDay[dayName] += parseDurationToHours(session.duration);
						}
					}
				});

				// Map to chart data format in correct order
				chartData.value = dayOrder.map((dayName, index) => ({
					day: dayName,
					dayIndex: index,
					hours: Math.max(hoursByDay[dayName] || 0, 0),
				}));

				console.log("Chart data:", chartData.value);
			} catch (error) {
				console.error("Error processing sessions data:", error);
				chartData.value = getInitialData();
			}
		};

		onMounted(() => {
			processSessionsData();
		});

		const xAccessor = (d) => d.dayIndex;
		const yAccessor = (d) => d.hours;
		const yDomain = [0, 4];

		// Explicit day labels for x-axis - must match the order in data
		const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

		return {
			chartData,
			xAccessor,
			yAccessor,
			yDomain,
			dayLabels,
		};
	},
};
</script>

<template>
	<div class="bar-chart-container">
		<div class="mb-4">
			<h3 class="text-lg font-semibold">Weekly Study Hours</h3>
			<p class="text-sm text-gray-600">This week</p>
		</div>
		<VisXYContainer
			:data="chartData"
			:height="300"
			:margin="{ top: 20, right: 20, bottom: 40, left: 50 }"
			:xDomain="[0, 6]"
			:yDomain="yDomain"
		>
			<VisGroupedBar
				:x="xAccessor"
				:y="[yAccessor]"
				:color="['#3b82f6']"
				:roundedCorners="0"
			/>
			<VisAxis
				type="x"
				:tickFormat="(d) => {
					const index = Math.round(d);
					return dayLabels[index] || '';
				}"
				:tickValues="[0, 1, 2, 3, 4, 5, 6]"
			/>
			<VisAxis
				type="y"
				:tickFormat="(d) => `${d}h`"
			/>
		</VisXYContainer>
	</div>
</template>

