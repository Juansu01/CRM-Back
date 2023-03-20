import { Request, Response } from "express";
import db from "../models";
import { FunnelAttributes } from "../models/funnel";

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
