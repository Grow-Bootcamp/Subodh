// ==========================================
// TYPEORM LEARNING TASK: TICKET
// ==========================================
//
// This represents a customer support ticket.
//
// Think about fields such as:
//
// - title
// - description
// - status
// - priority
// - dueAt
// - assignedTo
// - slaReminderSent
//
// IMPORTANT RELATIONSHIP:
//
// Ticket ---> User
//
// assignedTo should eventually reference a User row.
//
// Your tasks:
//
// 1. Decide the appropriate column types
//    (text, varchar, boolean, timestamptz, etc.).
// 2. Create the entity class.
// 3. Configure the User relation
//    (likely @ManyToOne on Ticket, @OneToMany on User).
// 4. Understand what a foreign key column stores.
// 5. Understand when TypeORM loads related data vs
//    leaving just the id / relation proxy.
//
// ------------------------------------------
// CONCEPT (TypeORM equivalent of Mongoose populate):
//
//   Without relation loading:
//     ticket.assignedTo → id (or unloaded relation)
//
//   With relation loading (relations: { assignedTo: true }):
//     ticket.assignedTo → full User entity
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Declaring assignedTo as a plain string/number column
//   instead of a relation → you store an id but cannot
//   "populate"/load the User in one query.
//
// - Defining @ManyToOne on Ticket AND @ManyToOne on User
//   (wrong side pairing), or missing the inverse side when
//   you need it → TypeORM relation config errors or lazy
//   surprises. Know which side holds the foreign key.
//
// - Storing dueAt as a string → comparisons like
//   "dueAt is in the past" become lexicographic and wrong.
//   Prefer Date / timestamptz.
//
// - Forgetting a default for slaReminderSent → column is
//   NULL. In SQL, NULL = false is unknown — your overdue
//   filter may skip or double-count rows. Default false.
//
// - Mixing status values freely ("Open", "OPEN", "open")
//   → CRON filter misses rows. Decide a small fixed set.
//
// - Expecting ticket.assignedTo to be a full User object
//   from a plain find() without loading the relation →
//   you get id only (or an unloaded relation). That's the
//   TypeORM equivalent of "forgot populate()".
//
// DO NOT copy a completed implementation.
// Build the entity yourself.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Notification from "./Notification.js";
import User from "./User.js";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

@Entity("tickets")
class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.tickets, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  assignedTo: User;

  @OneToMany(() => Notification, (notification) => notification.ticket)
  notifications: Notification[];

  @Column({ type: "varchar", length: 50 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "enum", enum: TicketPriority, default: "high" })
  priority: TicketPriority;

  @Column({ type: "timestamptz" })
  dueAt: Date;

  @Column({ type: "boolean", default: false })
  slaReminderSent: boolean;

  @Column({ type: "enum", enum: TicketStatus, default: "open" })
  status: TicketStatus;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}

export default Ticket;
