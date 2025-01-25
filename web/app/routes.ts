import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/login.tsx"),
	route("logout", "routes/logout.ts"),
	layout("layouts/Layout.tsx", [
		...prefix("dashboard", [
			index("routes/dashboard.tsx"),
			route("projects/:id", "routes/project.tsx"),
		]),
	]),
] satisfies RouteConfig;
