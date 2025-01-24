import { foreignKey, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: int().primaryKey(),
	name: text().notNull(),
	login: text().notNull().unique(),
	password: text().notNull(),

	createdAt: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const tasks = sqliteTable(
	"tasks",
	{
		id: int().primaryKey(),
		title: text().notNull(),
		description: text(),
		completed: int({ mode: "boolean" }).notNull().default(false),

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
