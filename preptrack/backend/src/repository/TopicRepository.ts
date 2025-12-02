import { Repository } from "typeorm";
import { Topic } from "../model/Topic";
import { PostgresDataSource } from "../config/Database";

export class TopicRepository {
  private repository: Repository<Topic>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Topic);
  }

  async createAndSave(topic: Partial<Topic>): Promise<Topic> {
    const createdTopic = this.repository.create(topic);
    return this.repository.save(createdTopic);
  }

  async findAll(): Promise<Topic[]> {
    return this.repository.find({ relations: ["track", "subtopics"] });
  }

  async findById(id: string): Promise<Topic | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["track", "subtopics"],
    });
  }

  async update(id: string, topic: Partial<Topic>): Promise<Topic | null> {
    const existingTopic = await this.findById(id);
    if (existingTopic === null) return null;
    Object.assign(existingTopic, topic);
    return this.repository.save(existingTopic);
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    return this.repository.findOne({
      where: { slug },
      relations: ["track", "subtopics"],
    });
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.repository.delete({ id });
    return (res.affected ?? 0) > 0;
  }
}
