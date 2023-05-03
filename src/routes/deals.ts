import { Router } from "express";
import {
  getAllDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  addUserToDeal,
  removeUserFromDeal,
  addStageToDeal,
  removeStageFromDeal,
} from "../controllers/dealsControllers";
import multer from "multer";
import {
  checkDealPost,
  checkRequestBodyIsFormData,
} from "../middlewares/checkRequestBody";

const dealsRouter = Router();
const upload = multer();

dealsRouter.get("/deals", getAllDeals);
dealsRouter.get("/deal/:id", getDeal);
dealsRouter.post("/deal", upload.single("logo"), checkDealPost, createDeal);
dealsRouter.patch(
  "/deal/:id",
  upload.single("logo"),
  checkRequestBodyIsFormData,
  updateDeal
);
dealsRouter.delete("/deal/:id", deleteDeal);
dealsRouter.post("/deal/:dealId/addUser/:userId", addUserToDeal);
dealsRouter.delete("/deal/:dealId/removeUser/:userId", removeUserFromDeal);
dealsRouter.post("/deal/:dealId/addStage/:stageId", addStageToDeal);
dealsRouter.delete("/deal/:dealId/removeStage/:stageId", removeStageFromDeal);

export default dealsRouter;
