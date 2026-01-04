<script>
import { computed, onMounted, ref } from "vue";
import { BookOpen, Clock, Filter, Search, Trash2 } from "lucide-vue-next";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";

export default {
	name: "SessionsView",

	components: {
		ContentHeader,
		PageWrapper,
		Card,
		Button,
		Search,
		BookOpen,
		Filter,
		Trash2,
		Clock,
	},

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions, deleteStudySession } = useStudySessions();

		const sessions = ref([]);
		const isLoading = ref(false);
		const searchQuery = ref("");

		// Parse duration string (e.g., "4m", "1h 30m", "45s") to minutes
		const parseDurationToMinutes = (durationStr) => {
			if (!durationStr) return 0;

			let totalMinutes = 0;
			const hourMatch = durationStr.match(/(\d+)h/);
			const minuteMatch = durationStr.match(/(\d+)m/);
			const secondMatch = durationStr.match(/(\d+)s/);

			if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
			if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
			if (secondMatch) totalMinutes += parseInt(secondMatch[1]) / 60;

			return totalMinutes;
		};

		// Format minutes to display string
		const formatDuration = (minutes) => {
			if (minutes < 1) {
				const seconds = Math.round(minutes * 60);
				return `${seconds}s`;
			}
			if (minutes < 60) {
				return `${Math.round(minutes)}min`;
			}
			const hours = Math.floor(minutes / 60);
			const mins = Math.round(minutes % 60);
			if (mins === 0) {
				return `${hours}h`;
			}
			return `${hours}h ${mins}min`;
		};

		const fetchSessions = async () => {
			if (!authStore.auth?.user?.id) return;

			isLoading.value = true;
			try {
				sessions.value = await getStudySessions(authStore.auth.user.id);
			} catch (error) {
				console.error("Error fetching study sessions:", error);
			} finally {
				isLoading.value = false;
			}
		};

		const handleDelete = async (sessionId) => {
			if (!confirm("Are you sure you want to delete this session?")) return;

			try {
				await deleteStudySession(sessionId);
				await fetchSessions();
			} catch (error) {
				console.error("Error deleting study session:", error);
			}
		};

		const filteredSessions = computed(() => {
			if (!searchQuery.value) return sessions.value;

			const query = searchQuery.value.toLowerCase();
			return sessions.value.filter(session =>
				session.subject?.toLowerCase().includes(query) ||
				session.notes?.toLowerCase().includes(query) ||
				session.date?.toLowerCase().includes(query)
			);
		});

		const totalSessions = computed(() => sessions.value.length);

		const totalHours = computed(() => {
			const totalMinutes = sessions.value.reduce((sum, session) => {
				return sum + parseDurationToMinutes(session.duration);
			}, 0);
			return (totalMinutes / 60).toFixed(1);
		});

		const avgDuration = computed(() => {
			if (sessions.value.length === 0) return "0min";
			const totalMinutes = sessions.value.reduce((sum, session) => {
				return sum + parseDurationToMinutes(session.duration);
			}, 0);
			const avg = totalMinutes / sessions.value.length;
			return formatDuration(avg);
		});

		onMounted(() => {
			fetchSessions();
		});

		return {
			sessions,
			isLoading,
			searchQuery,
			filteredSessions,
			totalSessions,
			totalHours,
			avgDuration,
			handleDelete,
		};
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Study Sessions"
      paragraph="View and manage your study sessions"
    />
    <div class="grid grid-cols-3 gap-6">
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Total sessions</div>
              <BookOpen size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                {{ totalSessions }}
              </div>
              <div class="text-xs">
                Logged study sessions
              </div>
            </div>
          </div>
        </Card>
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Total hours</div>
              <Clock size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                {{ totalHours }}h
              </div>
              <div class="text-xs">
                Time spent studying
              </div>
            </div>
          </div>
        </Card>
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Avg. Duration</div>
              <Clock size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                {{ avgDuration }}
              </div>
              <div class="text-xs">
                Per session
              </div>
            </div>
          </div>
        </Card>
        <Card class="col-span-3 col-start-1" title="Session Log" subtitle="Filter and search through your study session">
          <form @submit.prevent class="flex gap-2.5 mb-8 items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search sessions..."
              class="w-full text-sm p-2 border border-brand-primary"
            />
            <Button :icon="Filter" variant="outline" class="flex">
              <Filter size="18" />
              <div>
                Filter
              </div>
            </Button>
          </form>
          <div v-if="isLoading" class="text-center py-8">Loading sessions...</div>
          <table v-else class="table-auto w-full">
            <thead class="text-left border-b p-7">
              <tr>
                <th class="w-1/8">Subject</th>
                <th class="w-1/8">Duration</th>
                <th class="w-1/8">Date</th>
                <th class="w-1/8">Time</th>
                <th class="w-1/3">Notes</th>
                <th class="w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredSessions.length === 0" class="border-b">
                <td colspan="6" class="py-8 text-center text-sm text-gray-500">
                  No study sessions found
                </td>
              </tr>
              <tr v-for="session in filteredSessions" :key="session.id" class="border-b">
                <td class="px-0.5 py-3">
                  <span class="text-xs bg-blue-300 px-2 py-1">{{ session.subject }}</span>
                </td>
                <td class="py-4">{{ session.duration }}</td>
                <td class="py-4">{{ session.date }}</td>
                <td class="py-4">{{ session.time }}</td>
                <td class="py-4">{{ session.notes || "-" }}</td>
                <td class="py-4">
                  <button
                    @click="handleDelete(session.id)"
                    class="cursor-pointer hover:opacity-70"
                  >
                    <Trash2 color="#E54B4F" size="18"/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
    </div>
  </PageWrapper>

</template>
