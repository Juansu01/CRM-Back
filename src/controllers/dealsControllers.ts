import { Request, Response } from "express";
import db from "../models";

export const getAllDeals = async (req: Request, res: Response) => {
  const allDeals = await db.Deal.findAll();

  return res.status(200).json(allDeals);
};

export const createDeal = async (req: Request, res: Response) => {};
