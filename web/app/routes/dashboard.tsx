import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { session } from "~/cookies.server";
import { fetchTasks } from "~/lib/fetch";

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
				<div key={t.id} className="card shadow-md">
					<div className="card-body">
						<h2 className="card-title justify-center text-center">{t.title}</h2>
						{t.description && <p>{t.description}</p>}
						<div className="text-sm text-neutral-500 flex items-center justify-between">
							<span>Created at</span>
							<span>
								{Intl.DateTimeFormat("ru", {
									dateStyle: "short",
									timeStyle: "medium",
								}).format(new Date(t.createdAt))}
							</span>
						</div>
						<div className="text-sm text-neutral-500 flex items-center justify-between">
							<span>Updated at</span>
							<span>
								{Intl.DateTimeFormat("ru", {
									dateStyle: "short",
									timeStyle: "medium",
								}).format(new Date(t.updatedAt))}
							</span>
						</div>
						<div className="card-actions justify-end">
							<button type="button" className="btn btn-success">
								Complete
							</button>
						</div>
					</div>
				</div>
			))}
		</main>
	);
}

export default Dashboard;
