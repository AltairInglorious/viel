import { api } from "./api";

const port = process.env.PORT || 3000;
Bun.serve({
	port,
	fetch: api.fetch,
});
console.log(`Server running on :${port}`);
