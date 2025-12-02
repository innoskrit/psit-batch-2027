import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { SubTopic } from "./SubTopic";

@Entity({ name: "user_progress" })
@Unique(["user", "subtopic"])
export class UserProgress {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => SubTopic, { onDelete: "CASCADE" })
  subtopic!: SubTopic;

  @Column({ type: "boolean", default: false })
  isCompleted!: boolean;

  @Column({ type: "timestamp", nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
