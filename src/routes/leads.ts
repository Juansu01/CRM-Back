import { Router } from "express";
import {
  getAllLeads,
  getOneLead,
  postLead,
  patchLead,
  deleteLead,
} from "../controllers/leadsControllers";

import { emailExistsLead } from "../middlewares/emailExists";

const router = Router();

// CRUD
router.get("/leads", getAllLeads);
router.get("/lead/:leadId", getOneLead);
router.post("/lead", emailExistsLead, postLead);
router.patch("/lead/:leadId", patchLead);
router.delete("/lead/:leadId", deleteLead);

// Filtering

export default router;
