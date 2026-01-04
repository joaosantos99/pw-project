<script>
import { ref, computed, onMounted } from "vue";
import { TrophyIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { useGoals } from "@/composables/useGoals";
import {
	ACHIEVEMENTS,
	ACHIEVEMENT_CATEGORIES,
} from "@/constants/achievements";
import { TIMES_PERSETS_DURATION } from "@/constants/times";

export default {
	name: "LevelAchievements",

	components: {
		TrophyIcon,
	},

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();
		const { getGoals } = useGoals();

		const level = ref(1);
		const currentXP = ref(0);
		const xpNeeded = ref(1000);
		const earnedAchievements = ref([]);
		const sessions = ref([]);
		const goals = ref([]);

		// Parse duration string to minutes
		const parseDurationToMinutes = (duration) => {
			if (!duration) return 0;
			let totalMinutes = 0;
			const hourMatch = duration.match(/(\d+)h/);
			const minuteMatch = duration.match(/(\d+)m/);
			if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
			if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
			return totalMinutes;
		};

		// Calculate streak from sessions
		const calculateStreak = (sessions) => {
			if (sessions.length === 0) return 0;

			const validDates = sessions
				.map((s) => {
					try {
						const date = new Date(s.date);
						if (isNaN(date.getTime())) return null;
						date.setHours(0, 0, 0, 0);
						return date.getTime();
					} catch {
						return null;
					}
				})
				.filter((d) => d !== null);

			if (validDates.length === 0) return 0;

			const sessionDates = new Set(validDates);

			let streak = 0;
			let currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			while (sessionDates.has(currentDate.getTime())) {
				streak++;
				currentDate.setDate(currentDate.getDate() - 1);
			}

			return streak;
		};

		// Check if session matches preset duration
		const matchesPreset = (sessionDuration, preset) => {
			const sessionMinutes = parseDurationToMinutes(sessionDuration);
			const presetDuration = TIMES_PERSETS_DURATION[preset];
			return sessionMinutes === presetDuration;
		};

		// Calculate achievements
		const calculateAchievements = () => {
			const earned = [];

			ACHIEVEMENTS.forEach((achievement) => {
				let earnedValue = 0;
				let isEarned = false;

				switch (achievement.category) {
					case ACHIEVEMENT_CATEGORIES.TIME_PRESET: {
						const matchingSessions = sessions.value.filter((s) =>
							matchesPreset(s.duration, achievement.preset)
						);
						earnedValue = matchingSessions.length;
						isEarned = earnedValue >= achievement.threshold;
						break;
					}

					case ACHIEVEMENT_CATEGORIES.SESSION_COUNT: {
						earnedValue = sessions.value.length;
						isEarned = earnedValue >= achievement.threshold;
						break;
					}

					case ACHIEVEMENT_CATEGORIES.DURATION: {
						const totalMinutes = sessions.value.reduce(
							(sum, s) => sum + parseDurationToMinutes(s.duration),
							0
						);
						earnedValue = totalMinutes;
						isEarned = earnedValue >= achievement.threshold;
						break;
					}

					case ACHIEVEMENT_CATEGORIES.CONSISTENCY: {
						if (achievement.weekly) {
							// Check if user studied at least threshold days in a week
							const weekGroups = {};
							sessions.value.forEach((s) => {
								try {
									const date = new Date(s.date);
									if (isNaN(date.getTime())) return;
									const year = date.getFullYear();
									const startOfYear = new Date(year, 0, 1);
									const days = Math.floor(
										(date - startOfYear) / (24 * 60 * 60 * 1000)
									);
									const weekNumber = Math.floor(days / 7);
									const weekKey = `${year}-W${weekNumber}`;
									if (!weekGroups[weekKey]) {
										weekGroups[weekKey] = new Set();
									}
									weekGroups[weekKey].add(date.toDateString());
								} catch {
									// Skip invalid dates
								}
							});

							const weeksWithThreshold = Object.values(weekGroups).filter(
								(days) => days.size >= achievement.threshold
							).length;
							earnedValue = weeksWithThreshold;
							isEarned = weeksWithThreshold > 0;
						} else {
							// Daily streak
							earnedValue = calculateStreak(sessions.value);
							isEarned = earnedValue >= achievement.threshold;
						}
						break;
					}

					case ACHIEVEMENT_CATEGORIES.GOAL_COMPLETION: {
						// For now, count goals as completed if they exist
						// In a real app, you'd check if goals were actually completed
						if (achievement.timePeriod) {
							const matchingGoals = goals.value.filter(
								(g) => g.time_period === achievement.timePeriod
							);
							earnedValue = matchingGoals.length;
							isEarned = earnedValue >= achievement.threshold;
						} else {
							earnedValue = goals.value.length;
							isEarned = earnedValue >= achievement.threshold;
						}
						break;
					}

					case ACHIEVEMENT_CATEGORIES.MILESTONE: {
						if (achievement.timeBased) {
							// Check for early bird or night owl
							const hasMilestone = sessions.value.some((s) => {
								if (!s.time) return false;
								try {
									const timeParts = s.time.split(":");
									if (timeParts.length < 2) return false;
									const hour = parseInt(timeParts[0]);
									const isPM = s.time.includes("PM");
									const hour24 =
										isPM && hour !== 12
											? hour + 12
											: hour === 12 && !isPM
												? 0
												: hour;
									return achievement.id === "early_bird"
										? hour24 < 8
										: hour24 >= 22;
								} catch {
									return false;
								}
							});
							isEarned = hasMilestone;
							earnedValue = hasMilestone ? 1 : 0;
						} else if (achievement.durationBased) {
							// Check for marathon session
							const hasMarathon = sessions.value.some(
								(s) => parseDurationToMinutes(s.duration) >= achievement.threshold
							);
							isEarned = hasMarathon;
							earnedValue = hasMarathon ? 1 : 0;
						}
						break;
					}
				}

				earned.push({
					...achievement,
					earned: isEarned,
					progress: earnedValue,
					progressPercent: achievement.threshold
						? Math.min(100, (earnedValue / achievement.threshold) * 100)
						: isEarned ? 100 : 0,
				});
			});

			earnedAchievements.value = earned;
		};

		// Calculate XP based on study sessions
		const calculateXP = async () => {
			if (!authStore.auth?.user?.id) {
				return;
			}

			try {
				const fetchedSessions = await getStudySessions(authStore.auth.user.id);
				sessions.value = fetchedSessions;

				// Fetch goals
				try {
					const dailyGoals = await getGoals(
						authStore.auth.user.id,
						"daily"
					);
					const weeklyGoals = await getGoals(
						authStore.auth.user.id,
						"weekly"
					);
					const monthlyGoals = await getGoals(
						authStore.auth.user.id,
						"monthly"
					);
					goals.value = [...dailyGoals, ...weeklyGoals, ...monthlyGoals];
				} catch (error) {
					console.error("Error fetching goals:", error);
				}

				// Calculate achievements first to get earned achievements
				calculateAchievements();

				// Simple XP calculation: 1 XP per minute of study
				let totalMinutes = 0;

				fetchedSessions.forEach((session) => {
					totalMinutes += parseDurationToMinutes(session.duration);
				});

				// Add XP from earned achievements
				let achievementXP = 0;
				earnedAchievements.value.forEach((achievement) => {
					if (achievement.earned && achievement.xpReward) {
						achievementXP += achievement.xpReward;
					}
				});

				// Calculate level (every 1000 XP = 1 level)
				const totalXP = totalMinutes + achievementXP;
				level.value = Math.floor(totalXP / 1000) + 1;
				currentXP.value = totalXP % 1000;
			} catch (error) {
				console.error("Error calculating XP:", error);
			}
		};

		const xpProgress = computed(() => {
			return (currentXP.value / xpNeeded.value) * 100;
		});

		onMounted(() => {
			calculateXP();
		});

		const earnedAchievementsList = computed(() => {
			return earnedAchievements.value.filter((a) => a.earned);
		});

		return {
			level,
			currentXP,
			xpNeeded,
			xpProgress,
			earnedAchievementsList,
		};
	},
};
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<TrophyIcon size="20" class="text-brand-primary" />
			<h3 class="text-lg font-semibold text-brand-primary">Level {{ level }}</h3>
		</div>
		<p class="text-sm text-brand-primary">{{ currentXP }} / {{ xpNeeded }} XP</p>
		<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
			<div
				class="bg-brand-primary h-full rounded-full transition-all"
				:style="{ width: `${xpProgress}%` }"
			></div>
		</div>
		<div class="flex flex-wrap gap-2 mt-2">
			<div
				v-for="achievement in earnedAchievementsList"
				:key="achievement.id"
				class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200"
			>
				<TrophyIcon size="14" class="text-brand-primary" />
				<span class="text-xs text-brand-primary font-medium">{{ achievement.name }}</span>
			</div>
		</div>
	</div>
</template>

