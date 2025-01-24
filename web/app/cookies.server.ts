import { createCookie } from "react-router";

export const session = createCookie("session", {
	maxAge: 60 * 60 * 24 * 360, // 360 days
	httpOnly: true,
	secure: true,
});
