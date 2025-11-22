import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiLoginUrl, apiSessionsUrl, apiSignupUrl } from "@/constants/urls";
import { useAuthStore } from "@/stores/auth";

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
		const userResponse = await fetch(
			`${apiLoginUrl}?email=${email}&password=${password}`,
			{
				method: "GET",
			},
		);

		const [user] = await userResponse.json();

		const sessionSecret = `${user.id}-${Date.now().toString(36)}`;

		await fetch(apiSessionsUrl, {
			method: "POST",
			body: JSON.stringify({ user_id: user.id, secret: sessionSecret }),
		});

		await authStore.login(user, { user_id: user.id, secret: sessionSecret });
	};

	const logout = async () => {
		await authStore.logout();
	};

	const signup = async (name, email, password) => {
		const userResponse = await fetch(apiSignupUrl, {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
		});

		const user = await userResponse.json();

		const sessionSecret = `${user.id}-${Date.now().toString(36)}`;

		await fetch(apiSessionsUrl, {
			method: "POST",
			body: JSON.stringify({ user_id: user.id, secret: sessionSecret }),
		});

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
