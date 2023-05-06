import { NextFunction, Request, Response } from "express";
import db from "../models";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userEmail = req.body.user_email || req.params.user_email;

  try {
    const user = await db.User.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ message: "user not found" });
    if (!user.is_admin)
      return res.status(404).json({ message: "user is not admin" });
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isAdmin;
