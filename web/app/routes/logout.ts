import { redirect } from "react-router";
import { session } from "~/cookies.server";
import { logout } from "~/lib/fetch";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const cookieHeader = request.headers.get("Cookie");
		const cookie = await session.parse(cookieHeader);
		if (cookie) {
			await logout(cookie);
		}
	} catch (e) {
		if (e instanceof Error) console.error("Failed to parse cookie:", e);
		else console.error("Failed to parse cookie:", e);
	}

	return redirect("/", {
		headers: {
			"Set-Cookie": await session.serialize("", {
				expires: new Date(0),
				maxAge: 0,
			}),
		},
	});
}
