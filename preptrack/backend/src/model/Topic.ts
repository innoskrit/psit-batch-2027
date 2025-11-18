import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Track } from "./Track";
import { SubTopic } from "./SubTopic";

@Entity({ name: "topics" })
export class Topic {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 255 })
  slug!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Track, (track) => track.topics, { onDelete: "CASCADE" })
  track!: Track;

  @OneToMany(() => SubTopic, (subTopic) => subTopic.topic)
  subtopics!: SubTopic[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
