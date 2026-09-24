// ==========================================
// TYPEORM LEARNING TASK: USER
// ==========================================
//
// Create a User entity representing a support agent.
//
// Think about fields such as:
//
// - name
// - email
// - role
//
// Questions:
//
// 1. What type should each column use?
//    (string / varchar length, etc.)
// 2. Which columns should be nullable vs NOT NULL?
// 3. Should email be unique?
//    (Research @Index / unique options)
// 4. What does @Entity do?
// 5. What is the difference between a TypeScript
//    class and a TypeORM entity?
// 6. What is a primary key, and how does TypeORM
//    generate it by default?
//
// ------------------------------------------
// REMINDER:
//
// - An entity class describes the shape of a table's rows.
// - TypeORM maps decorated properties → table columns.
// - You need the entity defined before relations
//   from other entities (Ticket, Notification) can work.
//
// HINT: you will need decorators like
//   @Entity, @PrimaryGeneratedColumn, @Column
// imported from "typeorm"
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Confusing TypeScript types (string, number) with SQL
//   column types (varchar length, integer, timestamptz).
//   @Column({ type: "varchar", length: 255 }) is explicit
//   for a reason — decide types deliberately.
//
// - Not marking email unique → duplicate agents pile up and
//   later lookups by email become ambiguous.
//
// - Forgetting that reflect-metadata is imported once at
//   app entry (server.ts). Without it, decorator metadata
//   behavior can break in subtle ways.
//
// - Making every column nullable "to be safe" → SQL NULLs
//   propagate and code later does user.name.trim() on null.
//
// - Renaming a property after you already created rows with
//   synchronize → column mismatch; understand when schema
//   changes need migrations.
//
// IMPLEMENT THIS YOURSELF.
// Do NOT copy a completed implementation.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import Notification from "./Notification.js";
import Ticket from "./Ticket.js";

export enum UserRole {
  AGENT = "agent",
  ADMIN = "admin",
}

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", unique: true, length: 255 })
  email: string;

  @Column({ type: "enum", enum: UserRole, default: "agent" })
  role: UserRole;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  tickets: Ticket[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}

export default User;
