import { UserRole } from "../types/auth.js";
import type { User } from "../types/auth.js";

/**
 * DEMO ONLY.
 * In-memory users with plain-text passwords. No database, no hashing,
 * no registration. Password verification is left as a TODO for learning.
 */
export const users: User[] = [
  {
    id: 1,
    email: "admin@example.com",
    password: "password123",
    role: UserRole.ADMIN,
  },
  {
    id: 2,
    email: "user@example.com",
    password: "password123",
    role: UserRole.USER,
  },
];

export const findUserByEmail = (email: string): User | undefined =>
  users.find((user) => user.email === email);

export const findUserById = (id: number): User | undefined =>
  users.find((user) => user.id === id);
