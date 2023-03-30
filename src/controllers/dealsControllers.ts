import { Request, Response } from "express";
import db from "../models";
import * as fs from "fs";

export const getAllDeals = async (req: Request, res: Response) => {
  const allDeals = await db.Deal.findAll({
    include: [{ model: db.Funnel }, { model: db.User }, { model: db.Lead }],
  });

  return res.status(200).json(allDeals);
};

export const createDeal = async (req: Request, res: Response) => {
  const {
    user_id,
    company_name,
    deal_value_estimation,
    description,
    funnel_id,
    lead_id,
    name,
    order,
    status_id,
  } = req.body;
  const imageName = `${name + company_name}.png`;

  const newDeal = await db.Deal.create({
    user_id: user_id !== "" ? user_id : null,
    company_name,
    deal_value_estimation,
    description,
    funnel_id: funnel_id !== "" ? funnel_id : null,
    lead_id: lead_id !== "" ? lead_id : null,
    logo: imageName,
    order,
    status_id: status_id !== "" ? status_id : null,
  });

  if (newDeal) {
    fs.writeFile(`./deal_images/${imageName}`, req.files[0].buffer, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    const user = await db.User.findByPk(user_id);
    await newDeal.addUser(user);
    return res
      .status(200)
      .json({ message: "Deal created succesfully.", deal: newDeal });
  } else {
    return res.status(500).json({ message: "Couldn't create deal" });
  }
};
