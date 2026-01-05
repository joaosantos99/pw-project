import { get, put, del } from "@/utils/api";
import { API_URL } from "@/constants/env";

export function useUsers() {
	const getUsers = async () => {
		const users = await get(API_URL, "users");
		return users.map((user) => {
			const { password, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});
	};

	const updateUser = async (userId, { name, email, isAdmin }) => {
		const users = await get(API_URL, `users?id=${userId}`);
		const [user] = users;

		if (!user) {
			throw new Error("User not found");
		}

		return put(API_URL, `users/${userId}`, {
			...user,
			name,
			email,
			isAdmin: isAdmin ?? user.isAdmin ?? false,
		});
	};

	const deleteUser = async (userId) => {
		return del(API_URL, `users/${userId}`);
	};

	return {
		getUsers,
		updateUser,
		deleteUser,
	};
}

