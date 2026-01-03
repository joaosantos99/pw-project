import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "@/constants/env";
import { get, post } from "@/utils/api";
import { useAuthStore } from "@/stores/auth";
import { generateSessionSecret } from "@/utils/id";

export function useAuth() {
	const authStore = useAuthStore();
	const router = useRouter();

	const isAuthenticated = computed(() => authStore.isAuthenticated);

	const checkSession = async () => {
		if (!isAuthenticated.value) {
			router.push("/login");
		}
	};

	const login = async (email, password) => {
		const users = await get(API_URL, `users?email=${email}&password=${password}`);
		const [user] = users;

		const sessionSecret = generateSessionSecret(user.id);

		await post(API_URL, "sessions", { user_id: user.id, secret: sessionSecret });

		await authStore.login(user, { user_id: user.id, secret: sessionSecret });
	};

	const logout = async () => {
		await authStore.logout();
	};

	const signup = async (name, email, password) => {
		const user = await post(API_URL, "users", { name, email, password });

		const sessionSecret = generateSessionSecret(user.id);

		await post(API_URL, "sessions", { user_id: user.id, secret: sessionSecret });

		await authStore.login(user, { user_id: user.id, secret: sessionSecret });
	};

	onMounted(() => {
		checkSession();
	});

	return {
		authStore,
		checkSession,
		isAuthenticated,
		login,
		logout,
		signup,
	};
}
