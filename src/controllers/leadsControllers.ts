import { Request, Response } from "express";
import db from "../models";
import messageGenerator from "../services/messageGenerator";

export const getAllLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await db.Lead.findAll();
    if (!leads || leads.length === 0)
      return res.status(404).json(messageGenerator([], "no funnels found"));
    res.json(leads);
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const getOneLead = async (req: Request, res: Response) => {
  const leadId = req.params.leadId;

  try {
    const lead = await db.Lead.findByPk(leadId);
    if (!lead)
      return res.status(404).json(messageGenerator([], "no funnel found"));
    res.json(lead);
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const postLead = async (req: Request, res: Response) => {
  const newLeadBody = req.body;

  try {
    await db.Lead.create(newLeadBody);
    res.json(messageGenerator([], "new lead created"));
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const patchLead = async (req: Request, res: Response) => {
  const leadId = req.params.leadId;
  const patchBody = req.body;

  try {
    await db.Lead.update(patchBody, { where: { id: leadId } });
    return res.json(messageGenerator([], "lead updated"));
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  const leadId = req.params.leadId;

  try {
    await db.Lead.destroy({ where: { id: leadId } });
    res.json(messageGenerator([], "lead deleted"));
  } catch (e) {
    return res.status(500).json(messageGenerator(["errors", "server"]));
  }
};
