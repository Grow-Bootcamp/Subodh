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
