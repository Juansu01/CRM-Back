import { Router } from "express";

import {
  getStage,
  getAllStages,
  createStage,
  updateStage,
  deleteStage,
} from "../controllers/stagesControllers";
import checkAccessToken from "../middlewares/checkAccessToken";

const stagesRouter = Router();

stagesRouter.get("/stage/:id", checkAccessToken, getStage);
stagesRouter.get("/stages", checkAccessToken, getAllStages);
stagesRouter.post("/stage", checkAccessToken, createStage);
stagesRouter.patch("/stage/:id", checkAccessToken, updateStage);
stagesRouter.delete("/stage/:id", checkAccessToken, deleteStage);

export default stagesRouter;
