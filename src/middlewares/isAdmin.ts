import { NextFunction, Request, Response } from "express";
import db from "../models";

export const updateFunnelName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idUser = req.params.idUser;

  try {
    const user = db.User.findById(idUser);
    if (!user) return res.status(404).json({ mesage: "user not found" });
    if (!user.is_admin)
      return res.status(404).json({ mesage: "user is not admin" });
    next();
  } catch (e) {
    res.status(500).json({ mesage: "Internal server error" });
  }
};
