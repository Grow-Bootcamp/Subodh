import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "varchar" })
  contact: string;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "varchar" })
  gender: string;
}
