import { Hono } from "hono";
import type { sessions, users } from "../db/schema";
import { auth } from "./middlewares/auth";
import { projectsRouter } from "./projects";
import { tasksRouter } from "./tasks";
import { usersRouter } from "./users";

export type ApiContext = {
	Variables: {
		session?: typeof sessions.$inferSelect;
		user?: typeof users.$inferSelect;
	};
};

export type ApiAuthContext = {
	Variables: {
		session: typeof sessions.$inferSelect;
		user: typeof users.$inferSelect;
	};
};

export const api = new Hono<ApiContext>().basePath("/api");

api.use(auth);

api.route("/users", usersRouter);
api.route("/tasks", tasksRouter);
api.route("/projects", projectsRouter);
