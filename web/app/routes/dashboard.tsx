import { Form, redirect, useOutletContext } from "react-router";
import ProjectCard from "~/components/ProjectCard";
import { session } from "~/cookies.server";
import { type UserData, fetchProjects, fetchUser } from "~/lib/fetch";
import type { Route } from "./+types/dashboard";
import type { LayoutContext } from "~/layouts/Layout";
import addIcon from "~/assets/add-square.svg";
import { z } from "zod";

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

export async function action({ request }: Route.ActionArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (!cookie) return redirect("/");

	const formData = await request.formData();
	const data = z
		.object({
			title: z.string().min(1),
			description: z.string().optional(),
		})
		.parse({
			title: formData.get("title"),
			description: formData.get("description"),
		});

	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/api/projects";
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: cookie,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: data.title,
			description:
				data.description && data.description.length > 0
					? data.description
					: undefined,
		}),
	});

	if (res.status !== 201) {
		try {
			const resBody = await res.json();
			return {
				error: resBody.error ?? `Unknown error with status code: ${res.status}`,
			};
		} catch (e) {
			return { error: `Unknown error with status code: ${res.status}` };
		}
	}

	try {
		const project = await res.json();
		return { project };
	} catch (e) {
		return { error: `An unexpected error occurred: ${JSON.stringify(e)}` };
	}
}

function NewProject({ error }: { error?: string }) {
	const modalId = "new-project-modal";
	return (
		<>
			<button
				type="button"
				className="btn h-full min-h-[200px]"
				onClick={() =>
					(document.getElementById(modalId) as HTMLDialogElement).showModal()
				}
			>
				<img src={addIcon} alt="Create new project" className="w-8 h-8" />
			</button>
			<dialog id={modalId} className="modal">
				<div className="modal-box">
					<h2 className="font-bold text-lg mb-4 text-center">
						Create new project
					</h2>
					<Form
						method="post"
						action="/dashboard"
						className="form-control gap-2"
					>
						{error && (
							<div role="alert" className="alert alert-error">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title>Error message</title>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}
						<input
							type="text"
							className="input input-bordered"
							name="title"
							placeholder="Title"
							required
						/>
						<input
							type="text"
							className="input input-bordered"
							name="description"
							placeholder="Description"
						/>
						<button type="submit" className="btn">
							Create
						</button>
					</Form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button type="submit">close</button>
				</form>
			</dialog>
		</>
	);
}

function Dashboard({ loaderData, actionData }: Route.ComponentProps) {
	const { me } = useOutletContext<LayoutContext>();
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
				{me.role === "admin" && <NewProject error={actionData?.error} />}
			</div>
		</main>
	);
}

export default Dashboard;
