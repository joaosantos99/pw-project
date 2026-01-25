import { ref } from "vue";

const toasts = ref([]);

export function showSuccess(message) {
	const id = Date.now() + Math.random();
	toasts.value.push({
		id,
		type: "success",
		message,
	});

	setTimeout(() => {
		removeToast(id);
	}, 5000);

	return id;
}

export function showError(message) {
	const id = Date.now() + Math.random();
	toasts.value.push({
		id,
		type: "error",
		message,
	});

	setTimeout(() => {
		removeToast(id);
	}, 7000);

	return id;
}

export function removeToast(id) {
	const index = toasts.value.findIndex((toast) => toast.id === id);
	if (index > -1) {
		toasts.value.splice(index, 1);
	}
}

export function useToast() {
	return {
		toasts,
		showSuccess,
		showError,
		removeToast,
	};
}
