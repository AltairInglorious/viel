import { Hono } from "hono";
import type { ApiAuthContext } from ".";
import { db } from "../db";
import { projects, projectUsers, users } from "../db/schema";
import { isAuth } from "./middlewares/auth";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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

projectsRouter.get(
	"/:id",
	isAuth,
	zValidator("param", z.object({ id: z.coerce.number().int().nonnegative() })),
	async (c) => {
		const { id } = c.req.valid("param");
		const user = c.get("user");

		const project = await db.select().from(projects).where(eq(projects.id, id));
		if (project.length === 0) {
			c.status(404);
			return c.json({ error: "Project not found" });
		}

		if (user.role === "member") {
			if (project[0].owner === user.id) return c.json(project[0]);

			const projectMembers = await db
				.select()
				.from(projectUsers)
				.where(eq(projectUsers.projectId, id));
			if (!projectMembers.some((m) => m.userId === user.id)) {
				c.status(403);
				return c.json({ error: "Forbidden" });
			}
		}

		return c.json(project[0]);
	},
);
