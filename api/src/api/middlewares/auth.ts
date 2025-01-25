import { createMiddleware } from "hono/factory";
import type { ApiContext } from "..";
import { db } from "../../db";
import { sessions, users } from "../../db/schema";
import { eq } from "drizzle-orm";

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
