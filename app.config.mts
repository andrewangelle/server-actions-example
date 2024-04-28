import { createApp } from "vinxi";
import { serverComponents } from "@vinxi/server-components/plugin";
import { serverFunctions } from "@vinxi/server-functions/plugin";
import reactRefresh from "@vitejs/plugin-react";

const app = createApp({
	server: {
		experimental: {
			asyncContext: true
		},
	},
	routers: [
		{
			name: "public",
			type: "static",
			dir: "./public",
		},
		{
			name: "rsc",
			worker: true,
			type: "http",
			base: "/_rsc",
			handler: "./app/handlers/rsc.handler.tsx",
			target: "server",
			plugins: () => [
				serverComponents.server(), 
				reactRefresh()
			],
			middleware: './app/handlers/middleware.ts'

		},
		{
			name: "ssr",
			type: "http",
			handler: "./app/handlers/ssr.handler.tsx",
			target: "server",
			plugins: () => [],
			base: "/",
			middleware: './app/handlers/middleware.ts'
		},
		{
			name: "client",
			type: "client",
			handler: "./app/client/client.tsx",
			target: "browser",
			plugins: () => [
				serverFunctions.client({
					runtime: "@vinxi/react-server-dom/runtime",
				}),
				reactRefresh(),
				serverComponents.client(),
			],
			base: "/_build",
		},
	],
});

export default app;
