import { Request, Response } from "express";
import db from "../models";
import {
  saveImageLocally,
  deleteImageFromLocalStorage,
  uploadImageToCloudinary,
} from "../services/uploadToCloudinary";

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
  saveImageLocally(imageName, req.file.buffer);
  const result = await uploadImageToCloudinary(imageName, name + company_name);

  if (result.secure_url) {
    const newDeal = await db.Deal.create({
      name,
      user_id: user_id !== "" ? user_id : null,
      company_name,
      deal_value_estimation,
      description,
      funnel_id: funnel_id !== "" ? funnel_id : null,
      lead_id: lead_id !== "" ? lead_id : null,
      logo: result.secure_url,
      order,
      status_id: status_id !== "" ? status_id : null,
    });

    if (newDeal) {
      deleteImageFromLocalStorage(imageName);
      const user = await db.User.findByPk(user_id);
      if (user) {
        await newDeal.addUser(user);
        return res
          .status(200)
          .json({ message: "Deal created succesfully.", deal: newDeal });
      } else {
        return res.status(207).json({
          message: "User not found, won' add to new Deal",
          deal: newDeal,
        });
      }
    }
  } else {
    console.error("Couldn't upload image to Cloudinary");
    res.status(500).json({ message: "Couldn't upload image to Cloudinary" });
  }
};
