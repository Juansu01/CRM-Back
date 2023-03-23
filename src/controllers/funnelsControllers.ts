import { Request, Response } from "express";
import db from "../models";

import messageGenerator from "../services/messageGenerator";

import { FunnelAttributes } from "../models/funnel";

export const getAllFunnelsController = async (req: Request, res: Response) => {
  const funnels = await db.Funnel.findAll({
    include: [{ model: db.User }, { model: db.Stage }],
  });

  return res.status(200).json(funnels);
};

export const createNewFunnel = async (req: Request, res: Response) => {
  const { name, deal_id, email } = req.body;
  const user = await db.User.findOne({ where: { email } });
  let newFunnel: FunnelAttributes;

  if (user) {
    if (user.is_admin) {
      newFunnel = await db.Funnel.create({
        name,
        deal_id,
      });
    } else {
      return res.status(401).json({ message: "User is not an admin" });
    }

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

  if (!name || name === "")
    return res.json(messageGenerator([], "no funnel name provided"));

  try {
    await db.Funnel.update({ name: name }, { where: { id: idFunnel } });
    res.json(messageGenerator([], "funnel name updated"));
  } catch (e) {
    res.status(500).json(messageGenerator(["errors", "server"]));
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
    res.status(500).json(messageGenerator(["errors", "server"]));
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
    res.status(500).json(messageGenerator(["errors", "server"]));
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
    res.status(500).json(messageGenerator(["errors", "server"]));
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
    res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const deleteFunnel = async (req: Request, res: Response) => {
  const { email } = req.body;
  const funnelId = +req.params.id;
  const user = await db.User.findOne({ where: { email } });

  if (user) {
    const funnel = await db.Funnel.findOne({ where: { id: funnelId } });
    if (funnel) {
      if (user.is_admin) {
        await funnel.destroy();
        return res.status(200).json({ message: "Funnel succesfully deleted." });
      } else {
        return res
          .status(401)
          .json({ message: "User is not an admin, cannot delete" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Funnel was not found, cannot delete" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "User was not found, cannot delete Funnel" });
  }
};
