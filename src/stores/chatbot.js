import { defineStore } from "pinia";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/utils/localStorage";
import { CHAT_STORAGE_KEY, DEFAULT_MESSAGE } from "@/constants/chatbot";

export const useChatbotStore = defineStore("chatbot", {
	state: () => {
		const stored = getLocalStorage(CHAT_STORAGE_KEY);
		if (stored && Array.isArray(stored) && stored.length > 0) {
			return {
				messages: stored.map((msg) => ({
					...msg,
					timestamp: new Date(msg.timestamp),
				})),
			};
		}
		return {
			messages: [
				{
					...DEFAULT_MESSAGE,
					id: 1,
					timestamp: new Date(),
				},
			],
		};
	},

	actions: {
		addMessage(message) {
			this.messages.push({
				...message,
				id: this.messages.length + 1,
				timestamp: message.timestamp || new Date(),
			});
			this.persist();
		},

		removeMessage(messageId) {
			const index = this.messages.findIndex((m) => m.id === messageId);
			if (index !== -1) {
				this.messages.splice(index, 1);
				this.persist();
			}
		},

		resetMessages() {
			this.messages = [
				{
					...DEFAULT_MESSAGE,
					id: 1,
					timestamp: new Date(),
				},
			];
			removeLocalStorage(CHAT_STORAGE_KEY);
		},

		persist() {
			const messagesToSave = this.messages
				.filter((msg) => !msg.isLoading)
				.map((msg) => ({
					...msg,
					timestamp: msg.timestamp.toISOString(),
				}));
			setLocalStorage(CHAT_STORAGE_KEY, messagesToSave);
		},
	},
});
