<script>
import { computed, onMounted, ref } from "vue";
import { BookOpen, Clock, Filter, Search, Trash2 } from "lucide-vue-next";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";
import DeleteSessionModal from "@/components/DeleteSessionModal.vue";
import { useAuthStore } from "@/stores/auth";
import { useStudySessions } from "@/composables/useStudySessions";
import { useSubjects } from "@/composables/useSubjects";
import { parseDurationToMinutes } from "@/utils/dates";

export default {
	name: "SessionsView",

	components: {
		ContentHeader,
		PageWrapper,
		Card,
		Button,
		DeleteSessionModal,
		Search,
		BookOpen,
		Filter,
		Trash2,
		Clock,
	},

	setup() {
		const authStore = useAuthStore();
		const { getStudySessions, deleteStudySession } = useStudySessions();
		const { getSubjects } = useSubjects();

		const sessions = ref([]);
		const subjects = ref([]);
		const isLoading = ref(false);
		const searchQuery = ref("");
		const deleteModalRef = ref(null);

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

		const fetchSubjects = async () => {
			if (!authStore.auth?.user?.id) return;

			try {
				subjects.value = await getSubjects(authStore.auth.user.id);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};

		const subjectColorMap = computed(() => {
			const map = {};
			subjects.value.forEach(subject => {
				if (subject.name && subject.color) {
					map[subject.name.trim().toLowerCase()] = subject.color;
				}
			});
			return map;
		});

		const getSubjectColor = (subjectName) => {
			if (!subjectName) return "#3e43f0";
			const normalizedName = subjectName.trim().toLowerCase();
			return subjectColorMap.value[normalizedName] || "#3e43f0";
		};

		const getLuminance = (hex) => {
			const rgb = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
			if (!rgb) return 0.5;

			const r = parseInt(rgb[1], 16) / 255;
			const g = parseInt(rgb[2], 16) / 255;
			const b = parseInt(rgb[3], 16) / 255;

			const [rs, gs, bs] = [r, g, b].map(val => {
				return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
			});

			return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
		};

		const getContrastTextColor = (backgroundColor) => {
			const luminance = getLuminance(backgroundColor);
			if (luminance < 0.3) {
				return "#ffffff";
			} else if (luminance < 0.6) {
				return "#1f2937";
			} else {
				return "#000000";
			}
		};

		const handleDelete = (sessionId) => {
			const session = sessions.value.find(s => s.id === sessionId);
			if (session && deleteModalRef.value) {
				deleteModalRef.value.open(session);
			}
		};

		const handleSessionDeleted = () => {
			fetchSessions();
		};

		const filteredSessions = computed(() => {
			if (!searchQuery.value) return sessions.value;

			const query = searchQuery.value.toLowerCase();
			return sessions.value.filter(session => {
				const subject = session.subject || "Unspecified";
				return subject.toLowerCase().includes(query) ||
					session.notes?.toLowerCase().includes(query) ||
					session.date?.toLowerCase().includes(query);
			});
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
			fetchSubjects();
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
			handleSessionDeleted,
			getSubjectColor,
			getContrastTextColor,
			deleteModalRef,
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
              Filter
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
                  <span
                    class="text-xs px-2 py-1"
                    :style="{
                      backgroundColor: getSubjectColor(session.subject),
                      color: getContrastTextColor(getSubjectColor(session.subject))
                    }"
                  >{{ session.subject || "Unspecified" }}</span>
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
    <DeleteSessionModal ref="deleteModalRef" @deleted="handleSessionDeleted" />
  </PageWrapper>

</template>
