import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Topic } from "./Topic";

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

@Entity({ name: "subtopics" })
export class SubTopic {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  subtopicUrl!: string;

  @Column({ type: "text", nullable: true })
  articleUrl!: string;

  @Column({ type: "text", nullable: true })
  videoUrl!: string;

  @Column({ type: "enum", enum: Difficulty, default: Difficulty.EASY })
  difficulty!: Difficulty;

  @ManyToOne(() => Topic, (topic) => topic.subtopics, { onDelete: "CASCADE" })
  topic!: Topic;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
