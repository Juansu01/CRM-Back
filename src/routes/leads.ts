import { Router } from "express";
// import filterModelController from "../controllers/filterModelController";

const router = Router();

// CRUD
router.get("/leads");
router.get("/lead/:leadId");
router.post("/lead");
router.patch("/lead/:leadId");
router.delete("/lead/:leadId");

// Filtering

export default router;
