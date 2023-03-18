import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  updateFunnelName,
  addFunnelStage,
  removeFunnelStage,
  addFunnelUser,
  removeFunnelUser,
} from "../controllers/funnelsControllers";

import isAdmin from "../middlewares/isAdmin";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.post("/funnels", createNewFunnel);
funnelRouter.patch("/funnel/:idFunnel", isAdmin, updateFunnelName);
funnelRouter.post("/funnel/stage/:idFunnel", isAdmin, addFunnelStage);
funnelRouter.delete("/funnel/stage/:idFunnel", isAdmin, removeFunnelStage);
funnelRouter.post("/funnel/user/:idFunnel", addFunnelUser);
funnelRouter.delete("/funnel/user/:idFunnel", removeFunnelUser);

export default funnelRouter;
