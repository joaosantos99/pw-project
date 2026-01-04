<script>
import { ref, computed, onMounted } from "vue";
import { TrophyIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";

export default {
	name: "LevelAchievements",

	components: {
		TrophyIcon,
	},

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();

		const level = ref(12);
		const currentXP = ref(750);
		const xpNeeded = ref(1000);
		const achievements = ref([
			{ name: "Week Warrior", earned: true },
			{ name: "Focus Master", earned: true },
			{ name: "Early Bird", earned: true },
		]);

		// Calculate XP based on study sessions
		const calculateXP = async () => {
			if (!authStore.auth?.user?.id) {
				return;
			}

			try {
				const sessions = await getStudySessions(authStore.auth.user.id);
				// Simple XP calculation: 1 XP per minute of study
				let totalMinutes = 0;

				sessions.forEach((session) => {
					if (session.duration) {
						const hourMatch = session.duration.match(/(\d+)h/);
						const minuteMatch = session.duration.match(/(\d+)m/);
						if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
						if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
					}
				});

				// Calculate level (every 1000 XP = 1 level)
				const totalXP = totalMinutes;
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

		return {
			level,
			currentXP,
			xpNeeded,
			xpProgress,
			achievements,
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
				v-for="achievement in achievements"
				:key="achievement.name"
				class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200"
			>
				<TrophyIcon size="14" class="text-brand-primary" />
				<span class="text-xs text-brand-primary font-medium">{{ achievement.name }}</span>
			</div>
		</div>
	</div>
</template>

