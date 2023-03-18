import { Request, Response } from "express";
import db from "../models";

export const getAllFunnelsController = async (req: Request, res: Response) => {
  const funnels = await db.Funnel.findAll({
    include: [{ model: db.User }, { model: db.Stage }],
  });

  return res.status(200).json(funnels);
};

export const createNewFunnel = async (req: Request, res: Response) => {
  const { name, deal_id, email } = req.body;
  const user = await db.User.findOne({ where: { email } });

  if (user) {
    const newFunnel = await db.Funnel.create({
      name,
      deal_id,
    });
    if (newFunnel) {
      await user.addFunnel(newFunnel);
      return res.status(200).json(newFunnel);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "User was not found, cannot add Funnel" });
  }
};

export const updateFunnelName = async (req: Request, res: Response) => {
  const idFunnel = req.params.idFunnel;
  const name = req.body.name;

  if (!name || name === "") return res.json({ message: "no name provided" });

  try {
    await db.Funnel.update({ name: name }, { where: { id: idFunnel } });
    res.json({ mesage: "funnel name updated" });
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};

export const addFunnelStage = async (req: Request, res: Response) => {
  const idFunnel = req.params.idFunnel;
  const { idStage } = req.body;

  try {
    const funnelToUpdate = await db.Funnel.findByPk(idFunnel);
    const stageToAdd = await db.Stage.findByPk(idStage);

    funnelToUpdate.addStage(stageToAdd);
    res.json({ mesage: "stage added to funnel" });
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};

export const removeFunnelStage = async (req: Request, res: Response) => {
  const idFunnel = req.params.idFunnel;
  const { idStage } = req.body;

  try {
    const funnelToUpdate = await db.Funnel.findByPk(idFunnel);
    const stageToRemove = await db.Stage.findByPk(idStage);

    funnelToUpdate.removeStage(stageToRemove);
    res.json({ mesage: "stage removed from funnel" });
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};

export const addFunnelUser = async (req: Request, res: Response) => {
  const idFunnel = req.params.idFunnel;
  const { emailUser } = req.body;

  try {
    const funnelToUpdate = await db.Funnel.findByPk(idFunnel);
    const userToAdd = await db.User.findOne({ email: emailUser });

    funnelToUpdate.addUser(userToAdd);
    res.json({ mesage: "user added from funnel" });
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};

export const removeFunnelUser = async (req: Request, res: Response) => {
  const idFunnel = req.params.idFunnel;
  const { emailUser } = req.body;

  try {
    const funnelToUpdate = await db.Funnel.findByPk(idFunnel);
    const userToRemove = await db.User.findOne({ email: emailUser });

    funnelToUpdate.removeUser(userToRemove);
    res.json({ mesage: "user removed from funnel" });
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};
