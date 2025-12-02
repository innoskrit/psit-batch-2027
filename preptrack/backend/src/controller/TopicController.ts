import { Track } from "../model/Track";
import { TopicService } from "../service/TopicService";
import { Request, Response } from "express";
const topicService = new TopicService();

export const createTopic = async (request: Request, response: Response) => {
  try {
    const { trackId, ...topicData } = request.body;
    if (!trackId) {
      response.status(400).json({ message: "trackId is required" });
      return;
    }

    const payload = {
      ...topicData,
      track: { id: trackId } as Track,
    };
    const topic = await topicService.create(payload);
    response.status(200).json(topic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findTopics = async (_request: Request, response: Response) => {
  try {
    const topics = await topicService.findAll();
    response.status(200).json(topics);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findTopicById = async (request: Request, response: Response) => {
  const id = request.params.id;
  try {
    const topic = await topicService.findById(id!);
    if (topic === null) {
      response
        .status(404)
        .json({ message: `Topic is not found with the given id ${id}` });
      return;
    }
    response.status(200).json(topic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const updateTopic = async (request: Request, response: Response) => {
  const id = request.params.id;
  try {
    const topic = await topicService.update(id!, request.body);
    if (topic === null) {
      response
        .status(404)
        .json({ message: `Topic is not found with the given id ${id}` });
      return;
    }
    response.status(200).json(topic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findTopicBySlug = async (request: Request, response: Response) => {
  const slug = request.params.id;
  try {
    const topic = await topicService.findBySlug(slug!);
    if (topic === null) {
      response
        .status(404)
        .json({ message: `Topic is not found with the given slug ${slug}` });
      return;
    }
    response.status(200).json(topic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const deleteTopic = async (request: Request, response: Response) => {
  const id = request.params.id;
  try {
    const isDeleted = await topicService.delete(id!);
    if (isDeleted === false) {
      response
        .status(404)
        .json({ message: `Topic is not found with the given id ${id}` });
      return;
    }
    response.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};
