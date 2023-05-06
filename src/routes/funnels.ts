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
import checkAccessToken from "../middlewares/checkAccessToken";

const funnelRouter = Router();

funnelRouter.get("/funnels", checkAccessToken, getAllFunnelsController);
funnelRouter.delete(
  "/funnel/:id/:email",
  checkAccessToken,
  isAdmin,
  deleteFunnel
);
funnelRouter.post("/funnels", checkAccessToken, isAdmin, createNewFunnel);
funnelRouter.patch(
  "/funnel/:idFunnel",
  checkAccessToken,
  isAdmin,
  updateFunnelName
);
funnelRouter.post(
  "/funnel/stage/:idFunnel",
  checkAccessToken,
  isAdmin,
  addFunnelStage
);
funnelRouter.delete(
  "/funnel/stage/:idFunnel/:email",
  checkAccessToken,
  isAdmin,
  removeFunnelStage
);
funnelRouter.post(
  "/funnel/user/:idFunnel",
  checkAccessToken,
  isAdmin,
  addFunnelUser
);
funnelRouter.delete(
  "/funnel/user/:idFunnel/:email",
  checkAccessToken,
  isAdmin,
  removeFunnelUser
);

export default funnelRouter;
