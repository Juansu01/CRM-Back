import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  updateFunnelName,
  addFunnelStage,
  removeFunnelStage,
  addFunnelUser,
  removeFunnelUser,
  deleteFunnel,
} from "../controllers/funnelsControllers";

import isAdmin from "../middlewares/isAdmin";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.delete("/funnel/:id/:email", isAdmin, deleteFunnel);
funnelRouter.post("/funnels", isAdmin, createNewFunnel);
funnelRouter.patch("/funnel/:idFunnel", isAdmin, updateFunnelName);
funnelRouter.post("/funnel/stage/:idFunnel", isAdmin, addFunnelStage);
funnelRouter.delete("/funnel/stage/:idFunnel/:email", isAdmin, removeFunnelStage);
funnelRouter.post("/funnel/user/:idFunnel", isAdmin, addFunnelUser);
funnelRouter.delete("/funnel/user/:idFunnel/:email", isAdmin, removeFunnelUser);

export default funnelRouter;
