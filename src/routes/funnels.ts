import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  updateNameFunnel,
} from "../controllers/funnelsControllers";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.post("/funnels", createNewFunnel);
funnelRouter.patch("/funnel/:idFunnel", updateNameFunnel);

export default funnelRouter;
