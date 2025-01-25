import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { session } from "~/cookies.server";
import { fetchTasks } from "~/lib/fetch";
import TaskCard from "~/components/TaskCard";

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	return fetchTasks(cookie);
}

function Dashboard({ loaderData }: Route.ComponentProps) {
	return (
		<main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			{loaderData.map((t) => (
				<TaskCard key={t.id} task={t} />
			))}
		</main>
	);
}

export default Dashboard;
