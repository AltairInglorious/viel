import { Outlet, redirect } from "react-router";
import NavBar from "~/components/NavBar";
import { session } from "~/cookies.server";
import { type UserData, fetchMe } from "~/lib/fetch";
import type { Route } from "./+types/Layout";

export function meta() {
	return [{ title: "Viel" }];
}

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	return fetchMe(cookie);
}

export type LayoutContext = { me: UserData };

function Layout({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<NavBar me={loaderData} />
			<Outlet context={{ me: loaderData }} />
		</>
	);
}

export default Layout;
