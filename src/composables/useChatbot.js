import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "@/constants/env";
import { SYSTEM_CONTEXT } from "@/constants/chatbot";
import { useChatbotStore } from "@/stores/chatbot";

export function useChatbot() {
	const chatbotStore = useChatbotStore();

	const callGeminiAPI = async (userMessage, conversationHistory) => {
		if (!GEMINI_API_KEY) {
			throw new Error("Gemini API key is not configured");
		}

		const ai = new GoogleGenAI({
			apiKey: GEMINI_API_KEY,
		});

		const historyText = conversationHistory
			.filter((msg) => !msg.isLoading)
			.map((msg) => {
				const role = msg.sender === "user" ? "User" : "Assistant";
				return `${role}: ${msg.text}`;
			})
			.join("\n");

		const fullContext = `${SYSTEM_CONTEXT}\n\n${historyText}\n\nUser: ${userMessage}\n\nAssistant:`;

		const response = await ai.models.generateContent({
			model: "gemini-3-flash-preview",
			contents: fullContext,
		});

		return response.text;
	};

	return {
		chatbotStore,
		callGeminiAPI,
	};
}
