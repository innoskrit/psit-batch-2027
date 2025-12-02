import express from "express";
import {
  createTopic,
  deleteTopic,
  findTopicById,
  findTopicBySlug,
  findTopics,
  updateTopic,
} from "../controller/TopicController";
import { requireAdminRole, verifyToken } from "../middleware/AuthMiddleware";

const topicRouter = express.Router();

topicRouter.post("/topics", verifyToken, requireAdminRole, createTopic);
topicRouter.get("/topics", findTopics);
topicRouter.get("/topics/:id", findTopicById);
topicRouter.get("/topics/slug/:id", findTopicBySlug);
topicRouter.put("/topics/:id", verifyToken, requireAdminRole, updateTopic);
topicRouter.delete("/topics/:id", verifyToken, requireAdminRole, deleteTopic);

export default topicRouter;
