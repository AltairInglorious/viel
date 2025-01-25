import { Hono } from "hono";
import type { ApiAuthContext } from ".";
import { db } from "../db";
import { projects } from "../db/schema";
import { isAuth } from "./middlewares/auth";

export const projectsRouter = new Hono<ApiAuthContext>();

projectsRouter.get("/", isAuth, async (c) => {
	const user = c.get("user");
	const projectsList = await db.select().from(projects);
	return c.json(projectsList);
});
