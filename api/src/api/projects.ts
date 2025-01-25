import { Hono } from "hono";
import type { ApiContext } from ".";
import { isAuth } from "./middlewares/auth";
import { projects } from "../db/schema";
import { db } from "../db";

export const projectsRouter = new Hono<ApiContext>();

projectsRouter.get("/", isAuth, async (c) => {
	const projectsList = await db.select().from(projects);
	return c.json(projectsList);
});
