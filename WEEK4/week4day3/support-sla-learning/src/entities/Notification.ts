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
