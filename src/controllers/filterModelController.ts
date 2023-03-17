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

  if (model === "funnel") {
    queryConfig.where[attribute] = value;
    result = await db.Funnel.findAll(queryConfig);
  }

  return res.status(200).json(result);
};

export default filterModelController;
