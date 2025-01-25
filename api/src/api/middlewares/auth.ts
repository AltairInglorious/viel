import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import type { ApiContext } from "..";
import { db } from "../../db";
import { sessions, users } from "../../db/schema";

export const auth = createMiddleware<ApiContext>(async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (authHeader) {
		const tokenData = /^(\d+):(.+)$/.exec(authHeader);
		if (tokenData) {
			const session = await db
				.select()
				.from(sessions)
				.where(eq(sessions.id, Number(tokenData[1])));
			if (session.length === 1 && session[0].token === tokenData[2]) {
				c.set("session", session[0]);
				const user = await db
					.select()
					.from(users)
					.where(eq(users.id, session[0].userId));
				if (user.length === 1) {
					c.set("user", user[0]);
				}
			}
		}
	}

	await next();
});

export const isAuth = createMiddleware<ApiContext>(async (c, next) => {
	if (!c.get("session") || !c.get("user")) {
		c.status(401);
		return c.json({ error: "Unauthorized" });
	}
	await next();
});

export const isAdmin = createMiddleware<ApiContext>(async (c, next) => {
	const user = c.get("user");
	if (user && user.role === "admin") {
		await next();
	} else {
		c.status(403);
		return c.json({ error: "Forbidden" });
	}
});

export const isMember = createMiddleware<ApiContext>(async (c, next) => {
	const user = c.get("user");
	if (user && (user.role === "member" || user.role === "admin")) {
		await next();
	} else {
		c.status(403);
		return c.json({ error: "Forbidden" });
	}
});
