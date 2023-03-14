import db from "../models";
import express, { Router, Request, Response, NextFunction } from "express";

const funnelRouter = Router();

funnelRouter.get("/funnels", async (req, res) => {
  const funnels = await db.Funnel.findAll({
    include: {
      model: db.User,
    },
  });

  return res.status(200).json(funnels);
});

funnelRouter.post("/funnels", async (req, res) => {
  const { name, deal_id, email } = req.body;
  const user = await db.User.findOne({ where: { email } });

  if (user) {
    const newFunnel = await db.Funnel.create({
      name,
      deal_id,
    });
    await user.addFunnel(newFunnel);
    return res.status(200).json(newFunnel);
  } else {
    res.status(404).json({ message: "User was not found, cannot add Funnel" });
  }
});

export default funnelRouter;
