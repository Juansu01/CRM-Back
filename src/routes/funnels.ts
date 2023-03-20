import { Router } from "express";
import {
  getAllFunnelsController,
  createNewFunnel,
  deleteFunnel,
} from "../controllers/funnelsControllers";

const funnelRouter = Router();

funnelRouter.get("/funnels", getAllFunnelsController);
funnelRouter.delete("/funnels/:id", deleteFunnel);
funnelRouter.post("/funnels", createNewFunnel);

export default funnelRouter;
