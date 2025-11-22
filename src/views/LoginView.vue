<script>
import { mapActions, mapState } from "pinia";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { useAuth } from "@/composables/useAuth";
import { LAYOUTS } from "@/constants/layout";
import { useAuthStore } from "@/stores/auth";
import { validateEmail } from "@/utils/validators";

export default {
	name: "LoginView",

	components: {
		ContentHeader,
		PageWrapper,
	},

	data: () => ({
		LAYOUTS,
		email: "",
		password: "",
		loading: false,
		errors: {
			email: null,
			password: null,
		},
	}),

	computed: {
		...mapState(useAuthStore, ["isAuthenticated"]),
	},

	methods: {
		...mapActions(useAuth, ["login"]),
		async handleLogin(e) {
			const formData = new FormData(e.target);
			const email = formData.get("email");
			const password = formData.get("password");

			this.errors.email = validateEmail(email);
			this.errors.password = !!password && null;

			if (this.errors.email || this.errors.password) {
				return;
			}

			try {
				await this.login(email, password);
			} catch (error) {
				console.error("Error logging in:", error);
				this.error = error.message;
			} finally {
				if (this.isAuthenticated) {
					this.$router.push("/");
				}
			}
		},
	},
};
</script>

<template>
  <PageWrapper :layout="LAYOUTS.NAKED">
    <div class="w-full h-screen flex items-center justify-center">
      <div class="w-full max-w-md flex flex-col gap-8">
        <img src="../assets/logo.svg" alt="logo" class="w-full max-w-[320px] h-full object-contain mx-auto" />
        <Card title="Login" subtitle="Login to your account to get started">
          <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
            <InputField
              id="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              :error="errors.email"
            />
            <InputField
              id="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              :error="errors.password"
            />
            <Button variant="primary" type="submit">Login</Button>
          </form>
        </Card>
        <p class="text-center">Don't have an account? <RouterLink class="text-center text-bold" to="/signup">Sign Up</RouterLink></p>
      </div>
    </div>
  </PageWrapper>
</template>
