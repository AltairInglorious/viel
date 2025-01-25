import { redirect } from "react-router";
import ProjectCard from "~/components/ProjectCard";
import { session } from "~/cookies.server";
import { type UserData, fetchProjects, fetchUser } from "~/lib/fetch";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	const projects = await fetchProjects(cookie);

	const userIds = new Set<number>();
	for (const task of projects) {
		userIds.add(task.owner);
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

	return { projects, users };
}

function Dashboard({ loaderData }: Route.ComponentProps) {
	return (
		<main className="container mx-auto">
			<header>
				<h1 className="my-4 font-bold text-3xl text-center">Projects list</h1>
			</header>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{loaderData.projects.map((p) => (
					<ProjectCard
						key={p.id}
						project={p}
						owner={loaderData.users.get(p.owner)}
					/>
				))}
			</div>
		</main>
	);
}

export default Dashboard;
