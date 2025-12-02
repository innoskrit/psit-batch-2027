import { Repository } from "typeorm";
import { UserProgress } from "../model/UserProgress";
import { PostgresDataSource } from "../config/Database";

export class UserProgressRepository {
  private repository: Repository<UserProgress>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(UserProgress);
  }

  async saveUserProgress(
    userProgress: Partial<UserProgress>
  ): Promise<UserProgress> {
    return this.repository.save(userProgress);
  }
}
