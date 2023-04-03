import { Router } from "express";
import { getAllDeals, createDeal } from "../controllers/dealsControllers";
import multer from "multer";

const dealsRouter = Router();
const upload = multer();

dealsRouter.get("/deals", getAllDeals);
dealsRouter.post("/deal", upload.single("logo"), createDeal);

export default dealsRouter;
