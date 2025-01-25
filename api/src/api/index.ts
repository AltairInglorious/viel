import { Hono } from "hono";
import { usersRouter } from "./users";
import type { sessions, users } from "../db/schema";
import { auth } from "./middlewares/auth";
import { tasksRouter } from "./tasks";
import { projectsRouter } from "./projects";

export type ApiContext = {
	Variables: {
		session?: typeof sessions.$inferSelect;
		user?: typeof users.$inferSelect;
	};
};

export const api = new Hono<ApiContext>();

api.use(auth);

api.route("/users", usersRouter);
api.route("/tasks", tasksRouter);
api.route("/projects", projectsRouter);
