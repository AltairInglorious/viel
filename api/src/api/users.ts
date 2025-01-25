import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { ApiContext } from ".";
import { isAuth } from "./middlewares/auth";

export const usersRouter = new Hono<ApiContext>();

usersRouter.post(
	"/login",
	zValidator(
		"json",
		z.object({
			login: z.string().min(1),
			password: z.string().min(1),
		}),
	),
	async (c) => {
		const data = c.req.valid("json");

		const user = await db
			.select()
			.from(users)
			.where(eq(users.login, data.login));
		if (
			user.length !== 1 ||
			!(await Bun.password.verify(data.password, user[0].password))
		) {
			c.status(400);
			return c.json({ error: "Invalid login or password" });
		}

		const session = await db
			.insert(sessions)
			.values({
				userId: user[0].id,
			})
			.returning();
		if (session.length === 0) {
			c.status(500);
			return c.json({ error: "Failed to create session" });
		}

		c.status(200);
		return c.json({ token: `${session[0].id}:${session[0].token}` });
	},
);

usersRouter.post("/logout", async (c) => {
	const session = c.get("session");
	if (!session) {
		c.status(401);
		return c.json({ error: "Unauthorized" });
	}
	await db.delete(sessions).where(eq(sessions.id, session.id));
	c.status(200);
	return c.json({ message: "Logged out" });
});

usersRouter.get("/me", async (c) => {
	const user = c.get("user");
	if (!user) {
		c.status(401);
		return c.json({ error: "Unauthorized" });
	}
	return c.json({
		id: user.id,
		name: user.name,
		login: user.login,
		createdAt: user.createdAt,
	});
});

usersRouter.get(
	"/:id",
	isAuth,
	zValidator("param", z.object({ id: z.coerce.number().int().nonnegative() })),
	async (c) => {
		const { id } = c.req.valid("param");

		const user = await db.select().from(users).where(eq(users.id, id));
		if (user.length === 0) {
			c.status(404);
			return c.json({ error: "User not found" });
		}

		return c.json({
			id: user[0].id,
			name: user[0].name,
			login: user[0].login,
			createdAt: user[0].createdAt,
		});
	},
);
