import express from "express";
import {
  createTrack,
  deleteTrack,
  findTrackById,
  findTrackBySlug,
  findTracks,
  updateTrack,
} from "../controller/TrackController";
import { requireAdminRole, verifyToken } from "../middleware/AuthMiddleware";

const trackRouter = express.Router();

trackRouter.post("/tracks", verifyToken, requireAdminRole, createTrack);
trackRouter.get("/tracks", findTracks);
trackRouter.get("/tracks/:id", findTrackById);
trackRouter.get("/tracks/slug/:id", findTrackBySlug);
trackRouter.put("/tracks/:id", verifyToken, requireAdminRole, updateTrack);
trackRouter.delete("/tracks/:id", verifyToken, requireAdminRole, deleteTrack);

export default trackRouter;
