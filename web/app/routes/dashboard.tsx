import { redirect } from "react-router";
import TaskCard from "~/components/TaskCard";
import { session } from "~/cookies.server";
import { type UserData, fetchTasks, fetchUser } from "~/lib/fetch";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	const tasks = await fetchTasks(cookie);

	const userIds = new Set<number>();
	for (const task of tasks) {
		userIds.add(task.owner);
		if (task.assignTo) userIds.add(task.assignTo);
	}

	const users = new Map<number, UserData>();
	await Promise.all(
		Array.from(userIds).map(async (id) => {
			const user = await fetchUser(cookie, id).catch((e) => {
				if (e instanceof Error)
					console.error(`Failed to fetch user [${id}]: ${e.message}`);
				console.error(`Failed to fetch user [${id}]: Unknown error`);
			});
			if (user) users.set(id, user);
		}),
	);

	return { tasks, users };
}

function Dashboard({ loaderData }: Route.ComponentProps) {
	return (
		<main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			{loaderData.tasks.map((t) => (
				<TaskCard
					key={t.id}
					task={t}
					owner={loaderData.users.get(t.owner)}
					assignTo={t.assignTo ? loaderData.users.get(t.assignTo) : undefined}
				/>
			))}
		</main>
	);
}

export default Dashboard;
