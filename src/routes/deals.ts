import { Router } from "express";
import {
  getAllDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  addUserToDeal,
} from "../controllers/dealsControllers";
import multer from "multer";

const dealsRouter = Router();
const upload = multer();

dealsRouter.get("/deals", getAllDeals);
dealsRouter.get("/deal/:id", getDeal);
dealsRouter.post("/deal", upload.single("logo"), createDeal);
dealsRouter.patch("/deal/:id", upload.single("logo"), updateDeal);
dealsRouter.delete("/deal/:id", deleteDeal);
dealsRouter.post("/deal/:dealId/addUser/:userId", addUserToDeal);
dealsRouter.delete("/deal/:dealId/removeUser/:userId");
dealsRouter.post("/deal/:dealId/addStage/:stageId");
dealsRouter.delete("/deal/:dealId/removeStage/:stageId");

export default dealsRouter;
