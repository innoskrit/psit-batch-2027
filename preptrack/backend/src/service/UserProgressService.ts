import { UserProgress } from "../model/UserProgress";
import { UserProgressRepository } from "../repository/UserProgressRepository";

export class UserProgressService {
  private userProgressRepository: UserProgressRepository;

  constructor() {
    this.userProgressRepository = new UserProgressRepository();
  }

  async saveUserProgress(
    userProgress: Partial<UserProgress>
  ): Promise<UserProgress> {
    return this.userProgressRepository.saveUserProgress(userProgress);
  }
}
