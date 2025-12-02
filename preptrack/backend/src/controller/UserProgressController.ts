import { Request, Response } from "express";
import { UserProgressService } from "../service/UserProgressService";
import { User } from "../model/User";
import { SubTopic } from "../model/SubTopic";

const userProgressService = new UserProgressService();

export const saveProgress = async (request: Request, response: Response) => {
  const tokenUserId = request.user?.userId as string | undefined;

  if (!tokenUserId) {
    response.status(401).json({
      message: "Unauthorized. Unable to read user information from token.",
    });
    return;
  }

  const { userId, subtopicId, ...userProgress } = request.body;

  if (!userId) {
    response
      .status(400)
      .json({ message: "userId is required in the payload." });
    return;
  }

  if (userId !== tokenUserId) {
    response.status(400).json({
      message:
        "Bad request. You are not allowed to save progress for another user.",
    });
    return;
  }

  const payload = {
    ...userProgress,
    user: { id: tokenUserId } as User,
    subtopic: { id: subtopicId } as SubTopic,
  };
  const userProgressResponse = await userProgressService.saveUserProgress(
    payload
  );
  if (userProgressResponse == null) {
    response.status(409).json({ message: "Couldn't save the progress." });
    return;
  }

  if (userProgressResponse) {
    response
      .status(201)
      .json({ message: "Topic is marked completed.", userProgressResponse });
  } else {
    response.status(500).json({
      message: "Something went wrong.",
      userProgressResponse: null,
    });
  }
};
