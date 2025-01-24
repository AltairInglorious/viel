import PasswordInput from "~/components/PasswordInput";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Viel" }];
}

export default function Login() {
	return (
		<main className="h-screen flex items-center justify-center">
			<form className="form-control border rounded-lg max-w-lg w-full mx-4 gap-2 p-4">
				<input
					type="text"
					name="login"
					placeholder="Login"
					className="input input-bordered"
				/>
				<PasswordInput name="password" placeholder="Password" />
				<button type="submit" className="btn">
					Sign in
				</button>
			</form>
		</main>
	);
}
