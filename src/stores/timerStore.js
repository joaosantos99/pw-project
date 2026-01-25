import { defineStore } from "pinia";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { post } from "@/utils/api";
import { API_URL } from "@/constants/env";
import { TIMES_PERSETS_DURATION } from "@/constants/times";
import { useAuthStore } from "@/stores/auth";

const formatDuration = (milliseconds) => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	if (minutes > 0) {
		return `${minutes}m`;
	}
	return `${seconds}s`;
};

const formatTimeDisplay = (milliseconds) => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const STORAGE_KEY = "timerStore";

export const useTimerStore = defineStore("timer", {
	state: () => {
		const saved = getLocalStorage(STORAGE_KEY);
		const initialState = {
			timerSegments: [],
			targetDuration: 25 * 60 * 1000, // 25 minutes in milliseconds
			subject: null,
			notes: "",
			isMuted: false,
			sessionStartTime: null,
			currentTimestamp: Date.now(),
		};

		if (saved) {
			const restored = {
				...initialState,
				...saved,
			};

			// Clear notes and subject if there's no active session
			if (restored.timerSegments.length === 0 && restored.sessionStartTime === null) {
				restored.notes = "";
				restored.subject = null;
			}

			return restored;
		}

		return initialState;
	},

	getters: {
		elapsedTime: (state) => {
			let total = 0;

			for (const segment of state.timerSegments) {
				if (segment.end === null) {
					total += state.currentTimestamp - segment.start;
				} else {
					total += segment.end - segment.start;
				}
			}

			return total;
		},

		isRunning: (state) => {
			if (state.timerSegments.length === 0) {
				return false;
			}
			const lastSegment = state.timerSegments[state.timerSegments.length - 1];
			return lastSegment.end === null;
		},

		formattedTime() {
			const remaining = Math.max(0, this.targetDuration - this.elapsedTime);
			return formatTimeDisplay(remaining);
		},

		progress() {
			if (this.targetDuration === 0) {
				return 0;
			}
			return Math.min(1, this.elapsedTime / this.targetDuration);
		},

		status() {
			if (this.isRunning) {
				return "Running";
			}
			if (this.timerSegments.length === 0) {
				return "Ready to start";
			}
			return "Paused";
		},
	},

	actions: {
	startTimer() {
		if (this.isRunning) {
			return;
		}

		this.timerSegments.push({
			start: Date.now(),
			end: null,
		});

		if (this.sessionStartTime === null) {
			this.sessionStartTime = Date.now();
			this.notes = "";
			this.subject = null;
		}

		this.persist();
	},

		pauseTimer() {
			if (!this.isRunning) {
				return;
			}

			const lastSegment = this.timerSegments[this.timerSegments.length - 1];
			lastSegment.end = Date.now();

			this.persist();
		},

		toggleTimer() {
			if (this.isRunning) {
				this.pauseTimer();
			} else {
				this.startTimer();
			}
		},

	resetTimer() {
		this.timerSegments = [];
		this.sessionStartTime = null;
		this.notes = "";
		this.persist();
	},

		setPreset(preset) {
			const durationMinutes = TIMES_PERSETS_DURATION[preset];
			this.targetDuration = durationMinutes * 60 * 1000;
			this.persist();
		},

		setSubject(subject) {
			this.subject = subject;
			this.persist();
		},

		setNotes(notes) {
			this.notes = notes;
			this.persist();
		},

		toggleMute() {
			this.isMuted = !this.isMuted;
			this.persist();
		},

		updateTimestamp() {
			this.currentTimestamp = Date.now();
		},

		async saveSession() {
			if (this.elapsedTime === 0) {
				throw new Error("Cannot save session with zero duration");
			}

			const authStore = useAuthStore();
			const userId = authStore.auth?.user?.id;

			if (!userId) {
				throw new Error("User not authenticated");
			}

			const duration = formatDuration(this.elapsedTime);

			const sessionStart = this.sessionStartTime
				? new Date(this.sessionStartTime)
				: new Date();
			const date = sessionStart.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			const time = sessionStart.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});

			const subjectName = (this.subject && typeof this.subject === "object" && this.subject.name) 
			? this.subject.name 
			: "Unspecified";

			const payload = {
				user_id: userId,
				subject: subjectName,
				duration,
				date,
				time,
				notes: this.notes || "",
			};

			try {
				const response = await post(API_URL, "studySessions", payload);
				console.log("Session saved successfully:", response);

				this.resetTimer();
				this.notes = "";
				this.subject = null;

				return response;
			} catch (error) {
				console.error("Error saving session:", error);
				throw error;
			}
		},

		persist() {
			setLocalStorage(STORAGE_KEY, {
				timerSegments: this.timerSegments,
				targetDuration: this.targetDuration,
				subject: this.subject,
				notes: this.notes,
				isMuted: this.isMuted,
				sessionStartTime: this.sessionStartTime,
			});
		},
	},
});

