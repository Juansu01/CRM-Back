import { Request, Response } from "express";
import db from "../models";

export const getAllFunnelsController = async (req: Request, res: Response) => {
  const funnels = await db.Funnel.findAll({
    include: {
      model: db.User,
    },
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
