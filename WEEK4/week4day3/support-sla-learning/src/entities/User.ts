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
