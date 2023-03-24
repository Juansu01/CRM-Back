import { Request, Response } from "express";
import db from "../models";

const filterModelController = async (req: Request, res: Response) => {
  const model = req.params.model;
  const attribute = req.params.attribute;
  const value = req.query.value;
  const col = req.query.col;
  const order = req.query.order as string;
  const queryConfig = {
    where: {},
    order: [[col, order.toUpperCase()]],
  };
  let result;

  queryConfig.where[attribute] = value;

  if (model === "funnel") {
    queryConfig["include"] = [{ model: db.User }, { model: db.Stage }];
    result = await db.Funnel.findAll(queryConfig);
  }

  if (model === "lead") {
    // queryConfig["include"] = { model: db.Deal };
    result = await db.Lead.findAll(queryConfig);
  }

  return res.status(200).json(result);
};

export default filterModelController;
