<script>
import { CheckCircleIcon, XCircleIcon, XIcon } from "lucide-vue-next";

export default {
	name: "Toaster",

	data: () => ({
		CheckCircleIcon,
		XCircleIcon,
		XIcon,
	}),

	props: {
		toasts: {
			type: Array,
			required: true,
			default: () => [],
		},
	},

	methods: {
		handleClose(toastId) {
			this.$emit("close", toastId);
		},
	},
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed top-6 right-6 z-50 flex flex-col gap-3"
			role="region"
			aria-live="polite"
			aria-label="Notifications"
		>
			<transition-group name="toast" tag="div">
				<div
					v-for="toast in toasts"
					:key="toast.id"
					:class="[
						'flex items-start gap-3 p-4 min-w-[320px] max-w-[420px] border',
						toast.type === 'success'
							? 'bg-green-50 border-green-300 text-green-800'
							: 'bg-red-50 border-red-300 text-red-800',
					]"
					role="alert"
					:aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
				>
					<component
						:is="toast.type === 'success' ? CheckCircleIcon : XCircleIcon"
						size="20"
						class="shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<div class="flex-1">
						<p class="text-sm font-medium">{{ toast.message }}</p>
					</div>
					<button
						@click="handleClose(toast.id)"
						class="shrink-0 cursor-pointer hover:opacity-70"
						aria-label="Close notification"
					>
						<component :is="XIcon" size="18" aria-hidden="true" />
					</button>
				</div>
			</transition-group>
		</div>
	</Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
	transition: all 0.3s ease;
}

.toast-enter-from {
	opacity: 0;
	transform: translateX(100%);
}

.toast-leave-to {
	opacity: 0;
	transform: translateX(100%);
}

.toast-move {
	transition: transform 0.3s ease;
}
</style>
