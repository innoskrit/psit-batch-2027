import { Repository } from "typeorm";
import { SubTopic } from "../model/SubTopic";
import { PostgresDataSource } from "../config/Database";

export class SubTopicRepository {
  private repository: Repository<SubTopic>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(SubTopic);
  }

  async createAndSave(subTopic: Partial<SubTopic>): Promise<SubTopic> {
    const createdSubTopic = this.repository.create(subTopic);
    return this.repository.save(createdSubTopic);
  }

  async findAll(): Promise<SubTopic[]> {
    return this.repository.find({ relations: ["topic"] });
  }

  async findById(id: string): Promise<SubTopic | null> {
    return this.repository.findOne({ where: { id }, relations: ["topic"] });
  }

  async update(
    id: string,
    subTopic: Partial<SubTopic>
  ): Promise<SubTopic | null> {
    const existingSubTopic = await this.findById(id);
    if (existingSubTopic === null) return null;
    Object.assign(existingSubTopic, subTopic);
    return this.repository.save(existingSubTopic);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.repository.delete({ id });
    return (res.affected ?? 0) > 0;
  }

  async findByTopicId(topicId: string): Promise<SubTopic[]> {
    return this.repository.find({
      where: { topic: { id: topicId } },
      relations: ["topic"],
    });
  }
}
