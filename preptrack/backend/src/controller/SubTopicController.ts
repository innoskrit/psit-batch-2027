import { Request, Response } from "express";
import { SubTopicService } from "../service/SubTopicService";
import { Topic } from "../model/Topic";

const subTopicService = new SubTopicService();

export const createSubTopic = async (request: Request, response: Response) => {
  try {
    const { topicId, ...subTopicData } = request.body;
    if (!topicId) {
      response.status(400).json({ message: "topicId is required" });
      return;
    }

    const payload = {
      ...subTopicData,
      topic: { id: topicId } as Topic,
    };

    const subTopic = await subTopicService.create(payload);
    console.log("debugging create subtopic 3", subTopic);
    response.status(200).json(subTopic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findSubTopics = async (_request: Request, response: Response) => {
  try {
    const subTopics = await subTopicService.findAll();
    response.status(200).json(subTopics);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findSubTopicById = async (
  request: Request,
  response: Response
) => {
  const id = request.params.id;
  try {
    const subTopic = await subTopicService.findById(id!);
    if (subTopic === null) {
      response.status(404).json({
        message: `SubTopic is not found with the given id ${id}`,
      });
      return;
    }
    response.status(200).json(subTopic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const updateSubTopic = async (request: Request, response: Response) => {
  const id = request.params.id;
  try {
    const subTopic = await subTopicService.update(id!, request.body);
    if (subTopic === null) {
      response.status(404).json({
        message: `SubTopic is not found with the given id ${id}`,
      });
      return;
    }
    response.status(200).json(subTopic);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const deleteSubTopic = async (request: Request, response: Response) => {
  const id = request.params.id;
  try {
    const isDeleted = await subTopicService.delete(id!);
    if (isDeleted === false) {
      response.status(404).json({
        message: `SubTopic is not found with the given id ${id}`,
      });
      return;
    }
    response.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const findSubTopicsByTopicId = async (
  request: Request,
  response: Response
) => {
  const topicId = request.params.topicId;
  try {
    const subTopics = await subTopicService.findByTopicId(topicId!);
    response.status(200).json(subTopics);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};
