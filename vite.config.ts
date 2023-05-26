import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/server/webSocketUtils';

export default defineConfig({
	plugins: [sveltekit(), {
		"name": "integratedWebsocketServer",
		configureServer(server) {
			createWSSGlobalInstance();
			server.httpServer?.on('upgrade', onHttpServerUpgrade);
		}
	}],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
