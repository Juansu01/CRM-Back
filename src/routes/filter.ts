import { Router } from "express";
import filterModelController from "../controllers/filterModelController";

const filterRouter = Router();

filterRouter.get("/filter/:model/:attribute", filterModelController);

export default filterRouter;
