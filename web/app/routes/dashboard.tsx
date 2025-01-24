import React from "react";
import type { Route } from "./+types/dashboard";
import { session } from "~/cookies.server";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/users/me";
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: cookie,
		},
	});
	return res.json();
}

function Dashboard({ loaderData }: Route.ComponentProps) {
	return <div>Dashboard for {JSON.stringify(loaderData)}</div>;
}

export default Dashboard;
