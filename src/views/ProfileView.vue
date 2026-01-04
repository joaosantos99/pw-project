<script>
import { LogOutIcon } from "lucide-vue-next";
import { mapActions, mapState } from "pinia";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import InputField from "@/components/primitives/InputField.vue";
import Button from "@/components/primitives/Button.vue";
import Card from "@/components/primitives/Card.vue";
import { useAuthStore } from "@/stores/auth";
import { get, put } from "@/utils/api";
import { API_URL } from "@/constants/env";
import { setLocalStorage } from "@/utils/localStorage";
import { BUTTON_VARIANTS } from "@/constants/buttons";

export default {
	name: "ProfileView",

	components: {
		ContentHeader,
		PageWrapper,
		InputField,
		Button,
		Card,
	},

	data: () => ({
		BUTTON_VARIANTS,
		LogOutIcon,
		name: "",
		email: "",
		profileError: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		passwordError: "",
	}),

	computed: {
		...mapState(useAuthStore, ["auth"]),
		userId() {
			return this.auth?.user?.id;
		},
	},

	mounted() {
		if (this.auth?.user) {
			this.name = this.auth.user.name || "";
			this.email = this.auth.user.email || "";
		}
	},

	methods: {
		...mapActions(useAuthStore, ["logout"]),
		async handleLogout() {
			await this.logout();
			this.$router.push("/login");
		},
		async handleSaveProfile() {
			this.profileError = "";

			if (!this.name || !this.email) {
				this.profileError = "Name and email are required";
				return;
			}

			try {
				const users = await get(API_URL, `users?id=${this.userId}`);
				const [user] = users;

				if (!user) {
					this.profileError = "User not found";
					return;
				}

				const updatedUser = {
					...user,
					name: this.name,
					email: this.email,
				};

				await put(API_URL, `users/${this.userId}`, updatedUser);

				this.auth.user = updatedUser;
				setLocalStorage("auth", this.auth);

				this.profileError = "";
			} catch (error) {
				this.profileError = error.message || "Failed to update profile";
			}
		},
		handleCancelProfile() {
			if (this.auth?.user) {
				this.name = this.auth.user.name || "";
				this.email = this.auth.user.email || "";
			}
			this.profileError = "";
		},
		async handleChangePassword() {
			this.passwordError = "";

			if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
				this.passwordError = "All fields are required";
				return;
			}

			if (this.newPassword !== this.confirmPassword) {
				this.passwordError = "New passwords do not match";
				return;
			}

			if (this.newPassword.length < 6) {
				this.passwordError = "New password must be at least 6 characters";
				return;
			}

			try {
				const users = await get(API_URL, `users?id=${this.userId}`);
				const [user] = users;

				if (!user) {
					this.passwordError = "User not found";
					return;
				}

				if (user.password !== this.currentPassword) {
					this.passwordError = "Current password is incorrect";
					return;
				}

				await put(API_URL, `users/${this.userId}`, {
					...user,
					password: this.newPassword,
				});

				this.currentPassword = "";
				this.newPassword = "";
				this.confirmPassword = "";
				this.passwordError = "";
			} catch (error) {
				this.passwordError = error.message || "Failed to change password";
			}
		},
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Profile & Settings"
      paragraph="Manage your account and preferences"
      buttonLabel="Logout"
      :buttonIcon="LogOutIcon"
      :onClick="handleLogout"
    />
    <div class="flex flex-col gap-6">
      <Card
        title="Profile Information"
        subtitle="Update your personal information"
      >
        <div class="flex flex-col gap-4">
          <InputField
            id="name"
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            name="name"
            v-model="name"
            :error="profileError"
          />

          <InputField
            id="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            name="email"
            v-model="email"
          />
          <div class="flex justify-end gap-2">
            <Button
              :variant="BUTTON_VARIANTS.OUTLINE"
              :onClick="handleCancelProfile"
            >
              Cancel
            </Button>
            <Button
              :variant="BUTTON_VARIANTS.PRIMARY"
              :onClick="handleSaveProfile"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
      <Card
        title="Security"
        subtitle="Manage your password and security settings"
      >
        <div class="flex flex-col gap-4">
          <InputField
            id="current-password"
            label="Current Password"
            placeholder="Enter current password"
            type="password"
            name="currentPassword"
            v-model="currentPassword"
            :error="passwordError"
          />

          <InputField
            id="new-password"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            name="newPassword"
            v-model="newPassword"
          />

          <InputField
            id="confirm-password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            type="password"
            name="confirmPassword"
            v-model="confirmPassword"
          />
					<div class="flex justify-end">
						<Button
							:variant="BUTTON_VARIANTS.PRIMARY"
							:onClick="handleChangePassword"
						>
							Change Password
						</Button>
					</div>
        </div>
      </Card>
    </div>
  </PageWrapper>
</template>
