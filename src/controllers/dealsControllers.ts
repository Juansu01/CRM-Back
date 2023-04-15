import { Request, Response } from "express";
import db from "../models";
import {
  saveImageLocally,
  deleteImageFromLocalStorage,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../services/uploadToCloudinary";

export const getAllDeals = async (req: Request, res: Response) => {
  const allDeals = await db.Deal.findAll({
    include: [
      { model: db.Funnel },
      { model: db.User },
      { model: db.Lead },
      { model: db.Stage },
    ],
  });

  return res.status(200).json(allDeals);
};

export const getDeal = async (req: Request, res: Response) => {
  const id = req.params.id;
  const deal = await db.Deal.findByPk(id, {
    include: [
      { model: db.Funnel },
      { model: db.User },
      { model: db.Lead },
      { model: db.Stage },
    ],
  });

  if (deal) {
    return res
      .status(200)
      .json({ message: "Deal successfully found.", deal: deal });
  } else {
    return res.status(404).json({ message: "Deal was not found." });
  }
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
  const result = await uploadImageToCloudinary(imageName);

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
          message: "User not found, won't add to new Deal.",
          deal: newDeal,
        });
      }
    }
  } else {
    console.error("Couldn't upload image to Cloudinary.");
    res.status(500).json({ message: "Couldn't upload image to Cloudinary." });
  }
};

export const deleteDeal = async (req: Request, res: Response) => {
  const id = req.params.id;
  const dealToDelete = await db.Deal.findByPk(id);

  if (dealToDelete) {
    const imageToDelete = dealToDelete.name + dealToDelete.company_name;
    deleteImageFromCloudinary(imageToDelete);
    await dealToDelete.destroy();
    return res.status(200).json({ message: "Deal succesfully deleted" });
  } else {
    return res
      .status(404)
      .json({ message: "Deal was not found, cannot delete." });
  }
};

export const updateDeal = async (req: Request, res: Response) => {
  const id = req.params.id;
  const dealToUpdate = await db.Deal.findByPk(id);
  const dealAttributes = [
    "user_id",
    "company_name",
    "deal_value_estimation",
    "description",
    "funnel_id",
    "lead_id",
    "name",
    "order",
  ];

  if (dealToUpdate) {
    const previousLogo = dealToUpdate.name + dealToUpdate.company_name;
    for (let attribute of dealAttributes) {
      if (req.body[attribute] !== dealToUpdate[attribute]) {
        dealToUpdate[attribute] = req.body[attribute];
      }
    }

    if (req.file) {
      const newLogoName = dealToUpdate.name + dealToUpdate.company_name;
      deleteImageFromCloudinary(previousLogo);
      saveImageLocally(newLogoName, req.file.buffer);
      const result = await uploadImageToCloudinary(newLogoName);
      if (result.secure_url) {
        dealToUpdate.logo = result.secure_url;
        deleteImageFromLocalStorage(previousLogo);
      } else {
        return res.status(500).json({ message: "Couldn't upload new logo." });
      }
    }
    await dealToUpdate.save();
    return res
      .status(200)
      .json({ message: "Deal succesfully updated", deal: dealToUpdate });
  } else {
    return res.status(404).json({ message: "Deal not found." });
  }
};

export const addUserToDeal = async (req: Request, res: Response) => {
  const dealId = req.params.dealId;
  const userId = req.params.userId;
  const deal = await db.Deal.findByPk(dealId, {
    include: [{ model: db.User }],
  });

  if (deal) {
    const user = await db.User.findByPk(userId);
    if (user) {
      const dealUsers = await deal.getUsers();
      const userAlreadyInDeal = await dealUsers.some(
        (user) => user.id === +userId
      );
      if (userAlreadyInDeal) {
        return res.status(401).json({ message: "User already in Deal." });
      }
      await deal.addUser(user);
      return res
        .status(200)
        .json({ message: "User successfully added to Deal." });
    } else {
      return res.status(404).json({ message: "User was not found" });
    }
  } else {
    return res.status(404).json({ message: "Deal was not found." });
  }
};

export const removeUserFromDeal = async (req: Request, res: Response) => {
  const dealId = req.params.dealId;
  const userId = req.params.userId;
  const deal = await db.Deal.findByPk(dealId, {
    include: [{ model: db.User }],
  });

  if (deal) {
    const user = await db.User.findByPk(userId);
    if (user) {
      const dealUsers = await deal.getUsers();
      const userInDeal = await dealUsers.some((user) => user.id === +userId);
      if (userInDeal) {
        await deal.removeUser(user);
        return res
          .status(200)
          .json({ message: "User successfully removed from Deal." });
      }
      return res.status(401).json({ message: "User is not in Deal." });
    } else {
      return res.status(404).json({ message: "User was not found" });
    }
  } else {
    return res.status(404).json({ message: "Deal was not found." });
  }
};

export const addStageToDeal = async (req: Request, res: Response) => {
  const dealId = req.params.dealId;
  const stageId = req.params.stageId;
  const deal = await db.Deal.findByPk(dealId, {
    include: [{ model: db.Stage }],
  });

  if (deal) {
    const stage = await db.Stage.findByPk(stageId);
    if (stage) {
      const dealStages = await deal.getStages();
      const stageAlreadyInDeal = await dealStages.some(
        (stage) => stage.id === +stageId
      );
      if (stageAlreadyInDeal) {
        return res.status(401).json({ message: "Stage already in Deal." });
      }
      await deal.addStage(stage);
      return res
        .status(200)
        .json({ message: "Stage successfully added to Deal." });
    } else {
      return res.status(404).json({ message: "Stage was not found" });
    }
  } else {
    return res.status(404).json({ message: "Deal was not found." });
  }
};

export const removeStageFromDeal = async (req: Request, res: Response) => {
  const dealId = req.params.dealId;
  const stageId = req.params.stageId;
  const deal = await db.Deal.findByPk(dealId, {
    include: [{ model: db.Stage }],
  });

  if (deal) {
    const stage = await db.Stage.findByPk(stageId);
    if (stage) {
      const dealStages = await deal.getStages();
      const stageInDeal = await dealStages.some(
        (stage) => stage.id === +stageId
      );
      if (stageInDeal) {
        await deal.removeStage(stage);
        return res
          .status(200)
          .json({ message: "Stage successfully removed from Deal." });
      }
      return res.status(401).json({ message: "Stage is not in Deal." });
    } else {
      return res.status(404).json({ message: "Stage was not found" });
    }
  } else {
    return res.status(404).json({ message: "Deal was not found." });
  }
};
