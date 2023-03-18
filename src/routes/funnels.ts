import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  updateFunnelName,
  addFunnelStage,
  removeFunnelStage,
} from "../controllers/funnelsControllers";

import isAdmin from "../middlewares/isAdmin";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.post("/funnels", createNewFunnel);
funnelRouter.patch("/funnel/:idFunnel", isAdmin, updateFunnelName);
funnelRouter.post("/funnel/stage/:idFunnel", isAdmin, addFunnelStage);
funnelRouter.delete("/funnel/stage/:idFunnel", isAdmin, removeFunnelStage);

export default funnelRouter;
