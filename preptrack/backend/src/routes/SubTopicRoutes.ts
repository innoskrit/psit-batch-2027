import express from "express";
import {
  createSubTopic,
  deleteSubTopic,
  findSubTopicById,
  findSubTopics,
  findSubTopicsByTopicId,
  updateSubTopic,
} from "../controller/SubTopicController";
import { requireAdminRole, verifyToken } from "../middleware/AuthMiddleware";

const subTopicRouter = express.Router();

subTopicRouter.post("/subtopics", createSubTopic);
subTopicRouter.get("/subtopics", findSubTopics);
subTopicRouter.get("/subtopics/:id", findSubTopicById);
subTopicRouter.get("/topics/:topicId/subtopics", findSubTopicsByTopicId);
subTopicRouter.put(
  "/subtopics/:id",
  verifyToken,
  requireAdminRole,
  updateSubTopic
);
subTopicRouter.delete(
  "/subtopics/:id",
  verifyToken,
  requireAdminRole,
  deleteSubTopic
);

export default subTopicRouter;
