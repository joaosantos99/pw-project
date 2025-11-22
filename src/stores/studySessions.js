import { defineStore } from "pinia";

import {
	TIMES_PERSETS_DURATION,
	TIMES_PRESETS_BREAK_DURATION,
} from "@/constants/times";
import {
	getLocalStorage,
	setLocalStorage,
} from "@/utils/localStorage";

export const useStudySessionsStore = defineStore("studySessions", {
	state: () => ({ studySessions: getLocalStorage("studySessions") }),
	actions: {
		async setPreset(preset) {
			this.studySessions = {
				preset,
				duration: TIMES_PERSETS_DURATION[preset],
				breakDuration: TIMES_PRESETS_BREAK_DURATION[preset],
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async setSubject(subject) {
			this.studySessions = {
				subject,
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async setDuration(duration) {
			this.studySessions = {
				duration,
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async setBreakDuration(breakDuration) {
			this.studySessions = {
				breakDuration,
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async startTimer() {
			this.studySessions = {
				startedAt: Date.now(),
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async stopTimer() {
			this.studySessions = {
				stoppedAt: Date.now(),
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
		async resetTimer() {
			this.studySessions = {
				startedAt: null,
				stoppedAt: null,
				...this.studySessions,
			};
			setLocalStorage("studySessions", this.studySessions);
		},
	},
});
