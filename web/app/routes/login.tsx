import { Form, redirect } from "react-router";
import { z } from "zod";
import PasswordInput from "~/components/PasswordInput";
import { session } from "~/cookies.server";
import type { Route } from "./+types/login";

export function meta() {
	return [{ title: "Viel" }];
}

export async function loader({ request }: Route.LoaderArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = await session.parse(cookieHeader);
	if (cookie) return redirect("/dashboard");
}

export async function action({ request }: Route.ActionArgs) {
	try {
		const formData = await request.formData();
		const data = z
			.object({
				login: z.string().min(1),
				password: z.string().min(1),
			})
			.parse({
				login: formData.get("login"),
				password: formData.get("password"),
			});

		const url = new URL(process.env.API_URL ?? "");
		url.pathname = "/api/users/login";
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (res.status !== 200) {
			try {
				const resBody = await res.json();
				return resBody.error ?? `Unknown error with status code: ${res.status}`;
			} catch (e) {
				return `Unknown error with status code: ${res.status}`;
			}
		}

		const resBody = await res.json();
		return redirect("/dashboard", {
			headers: {
				"Set-Cookie": await session.serialize(resBody.token),
			},
		});
	} catch (e) {
		if (e instanceof Error) return `An error occurred: ${e.message}`;
		return `An unexpected error occurred: ${JSON.stringify(e)}`;
	}
}

export default function Login({ actionData }: Route.ComponentProps) {
	return (
		<main className="h-screen flex items-center justify-center">
			<Form
				className="form-control border rounded-lg max-w-lg w-full mx-4 gap-2 p-4"
				method="post"
			>
				{actionData && (
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
						<span>{actionData}</span>
					</div>
				)}
				<input
					type="text"
					name="login"
					placeholder="Login"
					className="input input-bordered"
					required
				/>
				<PasswordInput name="password" placeholder="Password" required />
				<button type="submit" className="btn">
					Sign in
				</button>
			</Form>
		</main>
	);
}
