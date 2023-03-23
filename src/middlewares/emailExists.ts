import { NextFunction, Request, Response } from "express";
import db from "../models";
import messageGenerator from "../services/messageGenerator";

const emailExistsGenerator = (model: string, emailWayAtrribute: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailToCheck = req.body[emailWayAtrribute];
      const entity = await db[model].findOne({
        where: { email: emailToCheck },
      });

      if (entity)
        return res
          .status(409)
          .json(messageGenerator([], "Email already taken"));
      next();
    } catch (e) {
      res.status(500).json(messageGenerator([], "Internal Server Error"));
    }
  };
};

export const emailExistsLead = emailExistsGenerator("Lead", "email");
