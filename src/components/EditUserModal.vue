<script>
import Modal from "@/components/primitives/Modal.vue";
import InputField from "@/components/primitives/InputField.vue";
import Button from "@/components/primitives/Button.vue";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import { useUsers } from "@/composables/useUsers";
import { useToast } from "@/composables/useToast";

export default {
	name: "EditUserModal",

	components: {
		Modal,
		InputField,
		Button,
	},

	data: () => ({
		isOpen: false,
		user: null,
		formData: {
			name: "",
			email: "",
			isAdmin: false,
		},
		isSubmitting: false,
		BUTTON_VARIANTS,
	}),

	methods: {
		open(user) {
			this.user = user;
			this.formData = {
				name: user.name || "",
				email: user.email || "",
				isAdmin: user.isAdmin || false,
			};
			this.isOpen = true;
		},
		close() {
			this.isOpen = false;
			this.resetForm();
		},
		handleCancel() {
			this.close();
		},
		resetForm() {
			this.formData = {
				name: "",
				email: "",
				isAdmin: false,
			};
			this.user = null;
		},
		async handleSubmit(event) {
			event.preventDefault();

			if (this.isSubmitting || !this.user) {
				return;
			}

			if (!this.formData.name || !this.formData.email) {
				return;
			}

			this.isSubmitting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { updateUser } = useUsers();
        await updateUser(this.user.id, {
          name: this.formData.name,
          email: this.formData.email,
          isAdmin: this.formData.isAdmin,
        });
        showSuccess("User updated successfully!");
        this.$emit("updated");
        this.close();
      } catch (error) {
        console.error("Error updating user:", error);
        showError(error.message || "Failed to update user. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
		},
	},
};
</script>

<template>
	<Modal
		v-if="isOpen"
		title="Edit User"
		description="Update user details"
		@close="close"
	>
		<form class="flex flex-col gap-4" @submit="handleSubmit">
			<InputField
				id="userName"
				name="userName"
				label="Name"
				placeholder="Enter user name"
				type="text"
				v-model="formData.name"
			/>
			<InputField
				id="userEmail"
				name="userEmail"
				label="Email"
				placeholder="Enter user email"
				type="email"
				v-model="formData.email"
			/>
			<div class="flex items-center gap-2">
				<input
					id="isAdmin"
					name="isAdmin"
					type="checkbox"
					v-model="formData.isAdmin"
					class="w-4 h-4"
				/>
				<label for="isAdmin" class="text-sm">Admin</label>
			</div>
			<div class="flex justify-end gap-4 mt-2">
				<Button
					type="button"
					:variant="BUTTON_VARIANTS.OUTLINE"
					:onClick="handleCancel"
				>
					Cancel
				</Button>
				<Button type="submit" :disabled="isSubmitting">
					{{ isSubmitting ? "Updating..." : "Update User" }}
				</Button>
			</div>
		</form>
	</Modal>
</template>

