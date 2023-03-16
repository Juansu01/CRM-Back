import db from "../models";
import express, { Router, Request, Response, NextFunction } from "express";

const filterRouter = Router();

filterRouter.get("/filter/:model/:attribute", async (req, res) => {
  const model = req.params.model;
  const attribute = req.params.attribute;
  const value = req.query.value;
  const col = req.query.col;
  const order = req.query.order;
  console.log(order);
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
});

export default filterRouter;