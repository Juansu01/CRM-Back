import { Request, Response } from "express";
import db from "../models";

export const acceptMagicUserInvitation = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
};
