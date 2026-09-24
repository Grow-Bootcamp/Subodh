// ==========================================
// TYPEORM LEARNING TASK: NOTIFICATION
// ==========================================
//
// A notification should eventually represent:
// "This agent has an SLA reminder for this ticket."
//
// Possible fields:
//
// - user
// - ticket
// - message
// - read
// - createdAt
//
// Tasks:
//
// 1. Design the entity.
// 2. Decide which properties should be relations
//    to other tables.
// 3. Configure those relations
//    (@ManyToOne / @OneToMany + inverse sides if useful).
// 4. Think about how relation loading could later
//    retrieve the related entities in one query.
//
// ------------------------------------------
// HINT:
//
// This entity will likely have TWO relations:
// one to User and one to Ticket.
//
// The CRON job will create these rows.
// GET /notifications/:userId will read them.
//
// ------------------------------------------
// COMMON PITFALLS:
//
// - Creating a Notification with only raw ids and expecting
//   GET /notifications to show user/ticket details without
//   loading relations → response is just foreign keys.
//
// - Wrong relation direction (ManyToMany "just in case") →
//   unnecessary join tables and harder queries. This is 1:many
//   from User/Ticket to notifications — keep it simple.
//
// - Storing message as required but later building it only in
//   CRON → decide nullability and who writes the message.
//
// - No createdAt (or wrong default) → hard to debug when a
//   reminder fired; you'll want a timestamp for learning tests.
//
// - Deleting a User/Ticket without thinking about notification
//   rows → orphaned notifications. Research ON DELETE behavior
//   enough to know what your choices imply (don't overbuild).
//
// IMPLEMENT THIS YOURSELF.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User.js";
import Ticket from "./Ticket.js";

@Entity("notifications")
class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  message: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.notifications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ticketId" })
  ticket: Ticket;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
export default Notification;
