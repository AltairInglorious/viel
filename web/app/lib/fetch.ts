if (!process.env.API_URL)
	throw new Error("API_URL environment variable not set");

export type UserData = {
	id: number;
	name: string;
	login: string;
	createdAt: string;
};
export async function fetchMe(token: string): Promise<UserData> {
	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/users/me";

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	});
	return res.json();
}

export async function logout(token: string): Promise<void> {
	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/users/logout";

	await fetch(url, {
		method: "POST",
		headers: {
			Authorization: token,
		},
	});
}
