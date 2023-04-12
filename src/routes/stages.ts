import { Router } from "express";
import {
  getStage,
  getAllStages,
  createStage,
  updateStage,
  deleteStage,
} from "../controllers/stagesControllers";

const stagesRouter = Router();

stagesRouter.get("/stage/:id", getStage);
stagesRouter.get("/stages", getAllStages);
stagesRouter.post("/stage", createStage);
stagesRouter.patch("/stage/:id", updateStage);
stagesRouter.delete("/stage/:id", deleteStage);

export default stagesRouter;
