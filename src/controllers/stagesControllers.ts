import { Request, Response } from "express";
import db from "../models";

export const getStage = async (req: Request, res: Response) => {
  const stageId = req.params.id;
  const stage = await db.Stage.findByPk(stageId);

  if (stage) {
    return res
      .status(200)
      .json({ message: "Stage was successfully found.", stage: stage });
  } else {
    return res.status(404).json({ message: "Stage was not found." });
  }
};

export const getAllStages = async (req: Request, res: Response) => {
  const allStages = await db.Stage.FindAll();

  return res.status(200).json(allStages);
};

export const createStage = async (req: Request, res: Response) => {
  const { color, name, deal_id } = req.body;
  const newStage = await db.create({
    color,
    name,
  });

  if (newStage) {
    if (deal_id) {
      const deal = await db.Deal.findByPk(deal_id);
      if (deal) {
        await deal.addStage(newStage);
      } else {
        return res
          .status(207)
          .json({
            message: "Deal was not found, created Stage with no Deal.",
            stage: newStage,
          });
      }
    }
    return res.json({
      message: "Stage was successfully created.",
      stage: newStage,
    });
  } else {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateStage = async (req: Request, res: Response) => {
  const stageId = req.params.id;
  const stageToUpdate = await db.Stage.findByPk(stageId);

  if (stageToUpdate) {
    stageToUpdate.name = req.body.name ? req.body.name : stageToUpdate.name;
    stageToUpdate.color = req.body.color ? req.body.color : stageToUpdate.color;
    await stageToUpdate.save();

    return res.json({
      message: "Stage successfully updated.",
      stage: stageToUpdate,
    });
  } else {
    return res.status(404).json({ message: "Stage was not found." });
  }
};

export const deleteStage = async (req: Request, res: Response) => {
  const stageId = req.params.id;
  const stage = await db.Stage.findByPk(stageId);

  if (stage) {
    await stage.destroy();
    res.json({ message: "Stage successfully deleted." });
  } else {
    res.status(404).json({ message: "Stage was not found." });
  }
};
