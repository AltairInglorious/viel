import { foreignKey, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const users = sqliteTable("users", {
	id: int().primaryKey(),
	name: text().notNull(),
	login: text().notNull().unique(),
	password: text().notNull(),

	role: text({ enum: ["member", "admin"] })
		.notNull()
		.default("member"),

	createdAt: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
	id: int().primaryKey(),
	userId: int()
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	token: text()
		.notNull()
		.$defaultFn(() => nanoid()),

	createdAt: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const projects = sqliteTable("projects", {
	id: int().primaryKey(),
	title: text().notNull(),
	description: text(),

	owner: int()
		.notNull()
		.references(() => users.id, {
			onDelete: "restrict",
			onUpdate: "cascade",
		}),

	createdAt: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const projectUsers = sqliteTable("projectUsers", {
	projectId: int()
		.notNull()
		.references(() => projects.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	userId: int()
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
});

export const tasks = sqliteTable(
	"tasks",
	{
		id: int().primaryKey(),
		title: text().notNull(),
		description: text(),
		status: text({ enum: ["todo", "in-work", "complete"] })
			.notNull()
			.default("todo"),

		owner: int()
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		assignTo: int().references(() => users.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
		parentTask: int(),
		project: int()
			.notNull()
			.references(() => projects.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),

		createdAt: int({ mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: int({ mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
	},
	(t) => [
		foreignKey({
			columns: [t.parentTask],
			foreignColumns: [t.id],
		}),
	],
);
