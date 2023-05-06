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
import checkAccessToken from "../middlewares/checkAccessToken";

const dealsRouter = Router();
const upload = multer();

dealsRouter.get("/deals", checkAccessToken, getAllDeals);
dealsRouter.get("/deal/:id", checkAccessToken, getDeal);
dealsRouter.post(
  "/deal",
  checkAccessToken,
  upload.single("logo"),
  checkDealPost,
  createDeal
);
dealsRouter.patch(
  "/deal/:id",
  checkAccessToken,
  upload.single("logo"),
  checkRequestBodyIsFormData,
  updateDeal
);
dealsRouter.delete("/deal/:id", checkAccessToken, deleteDeal);
dealsRouter.post(
  "/deal/:dealId/addUser/:userId",
  checkAccessToken,
  addUserToDeal
);
dealsRouter.delete(
  "/deal/:dealId/removeUser/:userId",
  checkAccessToken,
  removeUserFromDeal
);
dealsRouter.post(
  "/deal/:dealId/addStage/:stageId",
  checkAccessToken,
  addStageToDeal
);
dealsRouter.delete(
  "/deal/:dealId/removeStage/:stageId",
  checkAccessToken,
  removeStageFromDeal
);

export default dealsRouter;
