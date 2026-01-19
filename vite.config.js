import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/api/zenquotes": {
				target: "https://zenquotes.io",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/zenquotes/, "/api"),
			},
		},
	},
	test: {
		environment: "happy-dom",
	},
});
