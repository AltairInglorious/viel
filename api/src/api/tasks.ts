import { Hono } from "hono";
import type { ApiContext } from ".";
import { db } from "../db";
import { tasks } from "../db/schema";
import { isAuth } from "./middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const tasksRouter = new Hono<ApiContext>();

tasksRouter.get(
	"/",
	isAuth,
	zValidator(
		"query",
		z.object({
			project: z.coerce.number().int().nonnegative().optional(),
		}),
	),
	async (c) => {
		// TODO implement security
		const data = c.req.valid("query");
		const tasksList = data.project
			? await db.select().from(tasks).where(eq(tasks.project, data.project))
			: await db.select().from(tasks);
		return c.json(tasksList);
	},
);
