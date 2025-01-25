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

export async function fetchUser(
	token: string,
	id: number,
): Promise<UserData | null> {
	const url = new URL(process.env.API_URL ?? "");
	url.pathname = `/users/${id}`;

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	});
	if (res.status === 404) return null;
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

export type Task = {
	id: number;
	title: string;
	description: string | null;
	completed: boolean;
	owner: number;
	assignTo: number | null;
	parentTask: number | null;
	createdAt: string;
	updatedAt: string;
};

export async function fetchTasks(token: string): Promise<Task[]> {
	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/tasks";

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	});
	return res.json();
}

export type Project = {
	id: number;
	title: string;
	description: string | null;
	owner: number;
	createdAt: string;
};

export async function fetchProjects(token: string): Promise<Project[]> {
	const url = new URL(process.env.API_URL ?? "");
	url.pathname = "/projects";

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	});
	return res.json();
}
