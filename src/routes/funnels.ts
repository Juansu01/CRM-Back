import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  updateFunnelName,
  updateFunnelStage,
} from "../controllers/funnelsControllers";

import isAdmin from "../middlewares/isAdmin";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.post("/funnels", createNewFunnel);
funnelRouter.patch("/funnel/:idFunnel", isAdmin, updateFunnelName);
funnelRouter.patch("/funnel/stage/:idFunnel", isAdmin, updateFunnelStage);

export default funnelRouter;
