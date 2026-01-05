<script>
import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import EditUserModal from "@/components/EditUserModal.vue";
import DeleteUserModal from "@/components/DeleteUserModal.vue";
import Card from "@/components/primitives/Card.vue";
import Button from "@/components/primitives/Button.vue";
import { PencilIcon, Trash2Icon, ShieldIcon, Filter } from "lucide-vue-next";
import { useUsers } from "@/composables/useUsers";
import { useAuthStore } from "@/stores/auth";

export default {
	name: "UsersView",

	components: {
		ContentHeader,
		PageWrapper,
		EditUserModal,
		DeleteUserModal,
		Card,
		Button,
		Filter,
		PencilIcon,
		Trash2Icon,
		ShieldIcon,
	},

	data: () => ({
		PencilIcon,
		Trash2Icon,
		ShieldIcon,
		Filter,
		users: [],
		isLoading: false,
		searchQuery: "",
	}),

	computed: {
		isAdmin() {
			const authStore = useAuthStore();
			return authStore.auth?.user?.isAdmin === true;
		},
		filteredUsers() {
			if (!this.searchQuery) return this.users;

			const query = this.searchQuery.toLowerCase();
			return this.users.filter(
				(user) =>
					user.name?.toLowerCase().includes(query) ||
					user.email?.toLowerCase().includes(query)
			);
		},
	},

	async mounted() {
		if (!this.isAdmin) {
			this.$router.push("/");
			return;
		}
		await this.fetchUsers();
	},

	methods: {
		async fetchUsers() {
			this.isLoading = true;
			try {
				const { getUsers } = useUsers();
				this.users = await getUsers();
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				this.isLoading = false;
			}
		},
		handleEdit(user) {
			this.$refs.editUserModal.open(user);
		},
		async handleEditSuccess() {
			await this.fetchUsers();
		},
		handleDelete(user) {
			this.$refs.deleteUserModal.open(user);
		},
		async handleDeleteSuccess() {
			await this.fetchUsers();
		},
	},
};
</script>

<template>
	<PageWrapper>
		<ContentHeader
			title="Users Management"
			paragraph="Manage all users in the system"
		/>
		<Card
			title="Users"
			subtitle="Search and manage all users"
		>
			<form @submit.prevent class="flex gap-2.5 mb-8 items-center">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search users..."
					class="w-full text-sm p-2 border border-brand-primary"
				/>
				<Button :icon="Filter" variant="outline" class="flex">Filter</Button>
			</form>
			<div v-if="isLoading" class="text-center py-8">Loading users...</div>
			<table v-else class="table-auto w-full">
				<thead class="text-left border-b p-7">
					<tr>
						<th class="w-1/4">Name</th>
						<th class="w-1/3">Email</th>
						<th class="w-1/6">Role</th>
						<th class="w-1/12"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="filteredUsers.length === 0" class="border-b">
						<td colspan="4" class="py-8 text-center text-sm text-gray-500">
							No users found
						</td>
					</tr>
					<tr
						v-for="user in filteredUsers"
						:key="user.id"
						class="border-b"
					>
						<td class="py-4">{{ user.name }}</td>
						<td class="py-4">{{ user.email }}</td>
						<td class="py-4">
							<span
								v-if="user.isAdmin"
								class="text-xs bg-blue-300 px-2 py-1 flex items-center gap-1 w-fit"
							>
								<ShieldIcon size="12" />
								Admin
							</span>
							<span v-else class="text-xs text-gray-500">User</span>
						</td>
						<td class="py-4">
							<div class="flex items-center gap-2">
								<button
									@click="handleEdit(user)"
									class="cursor-pointer hover:opacity-70"
								>
									<PencilIcon size="18" class="text-brand-primary" />
								</button>
								<button
									@click="handleDelete(user)"
									class="cursor-pointer hover:opacity-70"
								>
									<Trash2Icon color="#E54B4F" size="18" />
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</Card>
		<EditUserModal ref="editUserModal" @updated="handleEditSuccess" />
		<DeleteUserModal ref="deleteUserModal" @deleted="handleDeleteSuccess" />
	</PageWrapper>
</template>

