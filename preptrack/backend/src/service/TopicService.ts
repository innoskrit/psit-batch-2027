import { Topic } from "../model/Topic";
import { TopicRepository } from "../repository/TopicRepository";

export class TopicService {
  private topicRepository: TopicRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
  }

  async create(topic: Partial<Topic>): Promise<Topic> {
    return this.topicRepository.createAndSave(topic);
  }

  async findAll(): Promise<Topic[]> {
    return this.topicRepository.findAll();
  }

  async findById(id: string): Promise<Topic | null> {
    return this.topicRepository.findById(id);
  }

  async update(id: string, topic: Partial<Topic>): Promise<Topic | null> {
    return this.topicRepository.update(id, topic);
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    return this.topicRepository.findBySlug(slug);
  }

  async delete(id: string): Promise<boolean> {
    return this.topicRepository.delete(id);
  }
}
