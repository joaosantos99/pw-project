// Generate a unique ID based on a prefix and timestamp
export const generateId = (prefix = "") => {
	const timestamp = Date.now().toString(36);
	return prefix ? `${prefix}-${timestamp}` : timestamp;
};

// Generate a session secret ID (used for auth sessions)
export const generateSessionSecret = (userId) => {
	return `${userId}-${Date.now().toString(36)}`;
};

