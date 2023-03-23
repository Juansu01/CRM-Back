import { Router } from "express";
import {
  getAllLeads,
  getOneLead,
  postLead,
  patchLead,
  deleteLead,
} from "../controllers/leadsControllers";

const router = Router();

// CRUD
router.get("/leads", getAllLeads);
router.get("/lead/:leadId", getOneLead);
router.post("/lead", postLead);
router.patch("/lead/:leadId", patchLead);
router.delete("/lead/:leadId", deleteLead);

// Filtering

export default router;
