import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue = null) {
	const storedValue = localStorage.getItem(key);
	const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue);

	watch(
		data,
		(newValue) => {
			if (newValue === null || newValue === undefined) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(newValue));
			}
		},
		{ deep: true },
	);

	const clear = () => {
		data.value = null;
		localStorage.removeItem(key);
	};

	return { data, clear };
}
