import { Hono } from "hono";
import type { ApiContext } from ".";
import { isAuth } from "./middlewares/auth";
import { tasks } from "../db/schema";
import { db } from "../db";

export const tasksRouter = new Hono<ApiContext>();

tasksRouter.get("/", isAuth, async (c) => {
	const tasksList = await db.select().from(tasks);
	return c.json(tasksList);
});
