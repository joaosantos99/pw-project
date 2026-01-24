<script>
import { mapState } from "pinia";
import { MessageCircle, X, Send, Bot, RotateCcw } from "lucide-vue-next";
import { useChatbot } from "@/composables/useChatbot";
import { useChatbotStore } from "@/stores/chatbot";

export default {
	name: "Chatbot",

	data() {
		const { callGeminiAPI } = useChatbot();

		return {
			MessageCircle,
			X,
			Send,
			Bot,
			RotateCcw,
			isOpen: false,
			inputMessage: "",
			isLoading: false,
			callGeminiAPI,
			chatbotStore: null,
		};
	},

	computed: {
		...mapState(useChatbotStore, ["messages"]),
	},

	created() {
		this.chatbotStore = useChatbotStore();
	},

	methods: {
		handleToggle() {
			this.isOpen = !this.isOpen;
		},

		handleClose() {
			this.isOpen = false;
		},

		handleResetChat() {
			this.chatbotStore.resetMessages();
			this.scrollToBottom();
		},

		scrollToBottom() {
			this.$nextTick(() => {
				const container = this.$refs.messagesContainer;
				if (container) {
					container.scrollTop = container.scrollHeight;
				}
			});
		},

		async handleSend() {
			if (!this.inputMessage.trim() || this.isLoading) return;

			const userMessage = this.inputMessage.trim();
			this.chatbotStore.addMessage({
				text: userMessage,
				sender: "user",
				timestamp: new Date(),
			});

			this.inputMessage = "";
			this.scrollToBottom();

			this.chatbotStore.addMessage({
				text: "Thinking...",
				sender: "bot",
				timestamp: new Date(),
				isLoading: true,
			});
			const loadingMessageId = this.messages[this.messages.length - 1].id;
			this.isLoading = true;
			this.scrollToBottom();

			try {
				const botResponse = await this.callGeminiAPI(userMessage, this.messages);

				this.chatbotStore.removeMessage(loadingMessageId);

				this.chatbotStore.addMessage({
					text: botResponse,
					sender: "bot",
					timestamp: new Date(),
				});
			} catch (error) {
				this.chatbotStore.removeMessage(loadingMessageId);

				this.chatbotStore.addMessage({
					text: `Sorry, I encountered an error: ${error.message}. Please check your API key configuration.`,
					sender: "bot",
					timestamp: new Date(),
				});
			} finally {
				this.isLoading = false;
				this.scrollToBottom();
			}
		},

		handleKeyPress(event) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				this.handleSend();
			}
		},
	},

	watch: {
		messages: {
			handler() {
				this.scrollToBottom();
			},
			deep: true,
		},
	},
};
</script>

<template>
	<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
		<div
			class="w-[400px] h-[600px] bg-brand-white border-2 border-brand-primary shadow-lg flex flex-col transition-all duration-300 ease-in-out origin-bottom-right"
			:class="[
				isOpen
					? 'opacity-100 scale-100 translate-y-0'
					: 'opacity-0 scale-95 translate-y-4 pointer-events-none',
			]"
		>
			<div
				class="flex items-center justify-between p-4 border-b border-brand-primary bg-brand-primary text-brand-white"
			>
				<div class="flex items-center gap-2">
					<component :is="Bot" size="20" />
					<span class="font-semibold">Chat Assistant</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						@click="handleResetChat"
						class="cursor-pointer hover:opacity-80 transition-opacity"
						title="Reset chat"
					>
						<component :is="RotateCcw" size="18" />
					</button>
					<button
						@click="handleClose"
						class="cursor-pointer hover:opacity-80 transition-opacity"
					>
						<component :is="X" size="20" />
					</button>
				</div>
			</div>

			<div
				class="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
				ref="messagesContainer"
			>
				<div
					v-for="message in messages"
					:key="message.id"
					:class="[
						'flex',
						message.sender === 'user' ? 'justify-end' : 'justify-start',
					]"
				>
					<div
						:class="[
							'max-w-[80%] rounded-lg px-4 py-2',
							message.sender === 'user'
								? 'bg-brand-primary text-brand-white'
								: 'bg-brand-gray text-brand-black',
							message.isLoading ? 'opacity-60' : '',
						]"
					>
						<p class="text-sm">{{ message.text }}</p>
					</div>
				</div>
			</div>

			<div class="border-t border-brand-primary p-4">
				<div class="flex gap-2">
					<input
						v-model="inputMessage"
						@keypress="handleKeyPress"
						type="text"
						placeholder="Type your message..."
						class="flex-1 text-sm p-2 border border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
					/>
					<button
						@click="handleSend"
						:disabled="!inputMessage.trim() || isLoading"
						class="px-4 py-2 bg-brand-primary text-brand-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center"
					>
						<component :is="Send" size="18" />
					</button>
				</div>
			</div>
		</div>

		<button
			@click="handleToggle"
			class="w-14 h-14 rounded-full bg-brand-primary text-brand-white shadow-lg hover:opacity-90 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
		>
			<component
				:is="isOpen ? X : MessageCircle"
				size="24"
				class="transition-transform duration-300"
				:class="{ 'rotate-90': isOpen }"
			/>
		</button>
	</div>
</template>
