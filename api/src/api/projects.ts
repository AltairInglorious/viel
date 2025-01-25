import { Hono } from "hono";
import type { ApiAuthContext } from ".";
import { db } from "../db";
import { projects, projectUsers, users } from "../db/schema";
import { isAuth } from "./middlewares/auth";
import { eq } from "drizzle-orm";

export const projectsRouter = new Hono<ApiAuthContext>();

projectsRouter.get("/", isAuth, async (c) => {
	const user = c.get("user");

	if (user.role === "admin") {
		const projectsList = await db.select().from(projects);
		return c.json(projectsList);
	}

	const records = await db
		.select()
		.from(projectUsers)
		.leftJoin(projects, eq(projectUsers.projectId, projects.id))
		.leftJoin(users, eq(projectUsers.userId, users.id))
		.where(eq(users.id, user.id));

	return c.json(records.map((r) => r.projects).filter((p) => p));
});
