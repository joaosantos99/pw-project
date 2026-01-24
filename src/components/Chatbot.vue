<script>
import { MessageCircle, X, Send, Bot } from "lucide-vue-next";

export default {
	name: "Chatbot",

	data() {
		return {
			MessageCircle,
			X,
			Send,
			Bot,
			isOpen: false,
			messages: [
				{
					id: 1,
					text: "Hello! How can I help you today?",
					sender: "bot",
					timestamp: new Date(),
				},
			],
			inputMessage: "",
		};
	},

	methods: {
		handleToggle() {
			this.isOpen = !this.isOpen;
		},

		handleClose() {
			this.isOpen = false;
		},

		scrollToBottom() {
			this.$nextTick(() => {
				const container = this.$refs.messagesContainer;
				if (container) {
					container.scrollTop = container.scrollHeight;
				}
			});
		},

		handleSend() {
			if (!this.inputMessage.trim()) return;

			// Add user message
			this.messages.push({
				id: this.messages.length + 1,
				text: this.inputMessage,
				sender: "user",
				timestamp: new Date(),
			});

			// Clear input
			const message = this.inputMessage;
			this.inputMessage = "";
			this.scrollToBottom();

			// Simulate bot response
			setTimeout(() => {
				this.messages.push({
					id: this.messages.length + 1,
					text: `I received your message: "${message}". This is a placeholder response.`,
					sender: "bot",
					timestamp: new Date(),
				});
				this.scrollToBottom();
			}, 500);
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
		<!-- Chat Window -->
		<div
			class="w-[400px] h-[600px] bg-brand-white border-2 border-brand-primary shadow-lg flex flex-col transition-all duration-300 ease-in-out origin-bottom-right"
			:class="[
				isOpen
					? 'opacity-100 scale-100 translate-y-0'
					: 'opacity-0 scale-95 translate-y-4 pointer-events-none',
			]"
		>
			<!-- Header -->
			<div
				class="flex items-center justify-between p-4 border-b border-brand-primary bg-brand-primary text-brand-white"
			>
				<div class="flex items-center gap-2">
					<component :is="Bot" size="20" />
					<span class="font-semibold">Chat Assistant</span>
				</div>
				<button
					@click="handleClose"
					class="cursor-pointer hover:opacity-80 transition-opacity"
				>
					<component :is="X" size="20" />
				</button>
			</div>

			<!-- Messages -->
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
						]"
					>
						<p class="text-sm">{{ message.text }}</p>
					</div>
				</div>
			</div>

			<!-- Input Area -->
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
						:disabled="!inputMessage.trim()"
						class="px-4 py-2 bg-brand-primary text-brand-white cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center"
					>
						<component :is="Send" size="18" />
					</button>
				</div>
			</div>
		</div>

		<!-- Floating Button -->
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
