import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
} from "../controllers/funnelsControllers";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.post("/funnels", createNewFunnel);

export default funnelRouter;
