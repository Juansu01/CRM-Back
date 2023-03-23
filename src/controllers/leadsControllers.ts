import { Request, Response } from "express";
import db from "../models";
import messageGenerator from "../services/messageGenerator";

export const getAllLeads = async (_req: Request, res: Response) => {
  try {
    const funnels = await db.Lead.findAll();
    if (!funnels)
      return res.status(404).json(messageGenerator([], "no funnels found"));
    res.json(funnels);
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const getOneLead = async (req: Request, res: Response) => {
  const leadId = req.params.leadId;

  try {
    const funnel = await db.Lead.findByPk(leadId);
    if (!funnel)
      return res.status(404).json(messageGenerator([], "no funnel found"));
    res.json(funnel);
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};
