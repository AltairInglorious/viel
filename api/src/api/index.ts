import { Hono } from "hono";

export const api = new Hono();

api.get("/", async (c) => c.text("Hello, Bun!"));
