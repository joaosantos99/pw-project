<script>
import Modal from "@/components/primitives/Modal.vue";
import Button from "@/components/primitives/Button.vue";
import { BUTTON_VARIANTS } from "@/constants/buttons";
import { useUsers } from "@/composables/useUsers";
import { useToast } from "@/composables/useToast";

export default {
	name: "DeleteUserModal",

	components: {
		Modal,
		Button,
	},

	data: () => ({
		isOpen: false,
		user: null,
		isDeleting: false,
		BUTTON_VARIANTS,
	}),

	emits: ["close", "deleted"],

	methods: {
		open(user) {
			this.user = user;
			this.isOpen = true;
		},
		close() {
			if (this.isDeleting) {
				return;
			}
			this.isOpen = false;
			this.user = null;
			this.$emit("close");
		},
		handleClose() {
			this.close();
		},
		handleCancel() {
			this.handleClose();
		},
		async handleConfirm() {
			if (!this.user || this.isDeleting) {
				return;
			}

			this.isDeleting = true;

      const { showSuccess, showError } = useToast();

      try {
        const { deleteUser } = useUsers();
        await deleteUser(this.user.id);
        showSuccess("User deleted successfully!");
        this.$emit("deleted");
        this.close();
      } catch (error) {
        console.error("Error deleting user:", error);
        showError(error.message || "Failed to delete user. Please try again.");
      } finally {
        this.isDeleting = false;
      }
		},
	},
};
</script>

<template>
	<Modal
		v-if="isOpen && user"
		title="Delete User"
		description="Are you sure you want to delete this user? This action cannot be undone."
		@close="handleClose"
	>
		<div class="flex flex-col gap-4">
			<p class="text-sm text-red-500">
				You are about to delete <strong>"{{ user.name }}"</strong> ({{ user.email }})
			</p>
			<div class="flex justify-end gap-4 mt-2">
				<Button
					:variant="BUTTON_VARIANTS.OUTLINE"
					:onClick="handleCancel"
					:disabled="isDeleting"
				>
					Cancel
				</Button>
				<Button
					:variant="BUTTON_VARIANTS.DANGER"
					:onClick="handleConfirm"
					:disabled="isDeleting"
				>
					{{ isDeleting ? "Deleting..." : "Delete" }}
				</Button>
			</div>
		</div>
	</Modal>
</template>

