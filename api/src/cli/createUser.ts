import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";

const name = z.string().min(1).parse(prompt("Enter user name:"));
const login = z.string().min(1).parse(prompt("Enter user login:"));
const password = z.string().min(1).parse(prompt("Enter user password:"));
const isAdmin = confirm("Make this user an admin?");

if (
	!confirm(`Are you sure you want to create a new user with the following details?
Name: ${name}
Login: ${login}
Password: ${password}`)
) {
	console.log("User creation cancelled.");
	process.exit(0);
}

const user = await db
	.insert(users)
	.values({
		name,
		login,
		password: Bun.password.hashSync(password),
		role: isAdmin ? "admin" : "member",
	})
	.returning();

console.log("User created successfully.");
console.log(Bun.inspect(user[0]));
