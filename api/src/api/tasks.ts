import { Hono } from "hono";
import type { ApiContext } from ".";
import { db } from "../db";
import { tasks } from "../db/schema";
import { isAuth } from "./middlewares/auth";

export const tasksRouter = new Hono<ApiContext>();

tasksRouter.get("/", isAuth, async (c) => {
	const tasksList = await db.select().from(tasks);
	return c.json(tasksList);
});
