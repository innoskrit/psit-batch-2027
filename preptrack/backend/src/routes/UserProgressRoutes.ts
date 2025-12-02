import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware";
import { saveProgress } from "../controller/UserProgressController";

const userProgressRouter = express.Router();
userProgressRouter.post("/progress", verifyToken, saveProgress);

export default userProgressRouter;
