<script>
import { mapActions, mapState } from "pinia";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { useAuth } from "@/composables/useAuth";
import { LAYOUTS } from "@/constants/layout";
import { useAuthStore } from "@/stores/auth";
import { validateEmail, validateSignupPassword } from "@/utils/validators";

export default {
	name: "SignupView",

	components: {
		ContentHeader,
		PageWrapper,
	},

	computed: {
		...mapState(useAuthStore, ["isAuthenticated"]),
	},

	data: () => ({
		LAYOUTS,
		errors: {
			name: null,
			email: null,
			password: null,
			confirmPassword: null,
		},
	}),

	methods: {
		...mapActions(useAuth, ["signup"]),
		async handleSignup(e) {
			const formData = new FormData(e.target);

			const name = formData.get("name");
			const email = formData.get("email");
			const password = formData.get("password");
			const confirmPassword = formData.get("confirmPassword");

			this.errors.name = !name ? "Name is required" : null;
			this.errors.email = validateEmail(email);
			this.errors.password = validateSignupPassword(password);
			console.log("password", password);
			console.log("confirmPassword", confirmPassword);
			this.errors.confirmPassword =
				password !== confirmPassword ? "Passwords do not match" : null;

			if (
				this.errors.name ||
				this.errors.email ||
				this.errors.password ||
				this.errors.confirmPassword
			) {
				return;
			}

			try {
				await this.signup(name, email, password);
			} catch (error) {
				console.error("Error signing up:", error);
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
        <Card title="Sign Up" subtitle="Create an account to get started">
          <form class="flex flex-col gap-4" @submit.prevent="handleSignup">
            <InputField
              id="name"
              name="name"
              label="Name"
              placeholder="Enter your name"
              type="text"
              :error="errors.name"
            />
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
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              :error="errors.confirmPassword"
            />
            <Button variant="primary" type="submit">Sign Up</Button>
          </form>
        </Card>
        <p class="text-center">Already have an account? <RouterLink class="text-center text-bold" to="/login">Login</RouterLink></p>
      </div>
    </div>
  </PageWrapper>
</template>
