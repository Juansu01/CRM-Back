import { Router } from "express";
import { getAllDeals, createDeal } from "../controllers/dealsControllers";

const dealsRouter = Router();

dealsRouter.get("/deals", getAllDeals);
dealsRouter.post("/deal", createDeal);

export default dealsRouter;
