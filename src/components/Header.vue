<script>
import { ref, computed, onMounted } from "vue";
import { Flame, Target, Menu } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { useGoals } from "@/composables/useGoals";
import { normalizeDate, parseDurationToHours } from "@/utils/dates";

export default {
	name: "Header",

	components: {
		Flame,
		Target,
    Menu
	},

	props: {
		isMenuOpen: {
			type: Boolean,
			default: false,
		},
	},

	emits: ["show-menu"],

	setup(props, { emit }) {
		const authStore = useAuthStore();
		const { getStudySessions } = useStudySessions();
		const { getGoals } = useGoals();

		const streak = ref(0);
		const todayHours = ref(0);
		const dailyGoal = ref(4);

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

			let streakCount = 0;
			let currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);

			while (sessionDates.has(currentDate.getTime())) {
				streakCount++;
				currentDate.setDate(currentDate.getDate() - 1);
			}

			return streakCount;
		};

		// Calculate header data
		const calculateHeaderData = async () => {
			if (!authStore.auth?.user?.id) {
				streak.value = 0;
				todayHours.value = 0;
				dailyGoal.value = 4;
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

				// Get sessions
				const sessions = await getStudySessions(authStore.auth.user.id);

				// Calculate streak
				streak.value = calculateStreak(sessions);

				// Calculate today's hours
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
				console.error("Error calculating header data:", error);
			}
		};

		const progressPercentage = computed(() => {
			if (dailyGoal.value === 0) return 0;
			return Math.min((todayHours.value / dailyGoal.value) * 100, 100);
		});

		const progressWidth = computed(() => {
			return `${progressPercentage.value}%`;
		});

		const handleShowMenu = () => {
			emit("show-menu");
		};

		onMounted(() => {
			calculateHeaderData();
		});

		return {
			streak,
			todayHours,
			dailyGoal,
			progressPercentage,
			progressWidth,
			handleShowMenu,
		};
	},
};
</script>

<template>
  <header class="z-1 bg-brand-white fixed top-0 right-0 w-full lg:w-[calc(100%-280px)] flex items-center justify-between px-8 py-4 border-b border-solid">

    <div class="flex space-x-8 items-center">
      <button
        @click="handleShowMenu"
        class="lg:hidden cursor-pointer"
        aria-label="Open navigation menu"
        :aria-expanded="isMenuOpen"
      >
        <Menu aria-hidden="true"/>
      </button>
      <!-- Streak -->
      <div class="flex space-x-4 items-center" role="status" aria-live="polite">
        <Flame
          color = "#E54B4F"
          aria-hidden="true"
        />
        <div>
          <div>
            Streak
          </div>
          <div class="font-semibold">
            {{ streak }} {{ streak === 1 ? 'day' : 'days' }}
          </div>
        </div>
      </div>

      <!-- Daily Goal -->
      <div class="flex space-x-4 items-center">
        <Target aria-hidden="true" />
        <div class="space-y-1">
          <div class="flex justify-between space-x-4">
            <div>Daily Goal</div>
            <div>{{ todayHours.toFixed(1) }}h/{{ dailyGoal }}h</div>
          </div>
          <div
            class="h-2 bg-neutral-200 rounded-xl overflow-hidden"
            role="progressbar"
            :aria-valuenow="progressPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`Daily goal progress: ${todayHours.toFixed(1)} hours out of ${dailyGoal} hours`"
          >
            <div class="bg-indigo-600 h-full transition-all duration-300" :style="{ width: progressWidth }" id="progress-bar">
            </div>
          </div>
        </div>
      </div>
    </div>


    <button
      aria-label="Toggle theme"
      class="cursor-pointer"
    >
    </button>

  </header>

</template>

<style scoped>

</style>
