import { SubTopic } from "../model/SubTopic";
import { SubTopicRepository } from "../repository/SubTopicRepository";

export class SubTopicService {
  private subTopicRepository: SubTopicRepository;

  constructor() {
    this.subTopicRepository = new SubTopicRepository();
  }

  async create(subTopic: Partial<SubTopic>): Promise<SubTopic> {
    return this.subTopicRepository.createAndSave(subTopic);
  }

  async findAll(): Promise<SubTopic[]> {
    return this.subTopicRepository.findAll();
  }

  async findById(id: string): Promise<SubTopic | null> {
    return this.subTopicRepository.findById(id);
  }

  async update(
    id: string,
    subTopic: Partial<SubTopic>
  ): Promise<SubTopic | null> {
    return this.subTopicRepository.update(id, subTopic);
  }

  async delete(id: string): Promise<boolean> {
    return this.subTopicRepository.delete(id);
  }

  async findByTopicId(topicId: string): Promise<SubTopic[]> {
    return this.subTopicRepository.findByTopicId(topicId);
  }
}
