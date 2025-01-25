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
	layout("layouts/Layout.tsx", [route("dashboard", "routes/dashboard.tsx")]),
] satisfies RouteConfig;
