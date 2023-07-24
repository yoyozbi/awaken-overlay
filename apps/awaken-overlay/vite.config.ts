import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';

export default defineConfig({
	plugins: [sveltekit(), vitePluginTrpcWebSocket],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
