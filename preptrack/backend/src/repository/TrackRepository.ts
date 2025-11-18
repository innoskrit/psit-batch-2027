import { Repository } from "typeorm";
import { Track } from "../model/Track";
import { PostgresDataSource } from "../config/Database";

export class TrackRepository {
  private repository: Repository<Track>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Track);
  }

  async createAndSave(track: Partial<Track>): Promise<Track> {
    const createdTrack = this.repository.create(track);
    return this.repository.save(createdTrack);
  }

  async findAll(): Promise<Track[]> {
    return this.repository.find({ relations: ["topics", "topics.subtopics"] });
  }

  async findById(id: string): Promise<Track | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["topics", "topics.subtopics"],
    });
  }

  async update(id: string, track: Partial<Track>): Promise<Track | null> {
    const existingTrack = await this.findById(id);
    if (existingTrack === null) return null;
    Object.assign(existingTrack, track);
    return this.repository.save(existingTrack);
  }

  async findBySlug(slug: string): Promise<Track | null> {
    return this.repository.findOne({
      where: { slug },
      relations: ["topics", "topics.subtopics"],
    });
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.repository.delete({ id });
    return (res.affected ?? 0) > 0;
  }
}
