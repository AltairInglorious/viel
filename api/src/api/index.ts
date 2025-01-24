import { Hono } from "hono";
import { usersRouter } from "./users";

export const api = new Hono();

api.route("/users", usersRouter);
