import { Router } from "express";
import {
  getAllLeads,
  getOneLead,
  postLead,
  patchLead,
  deleteLead,
  orderLeads,
  filterLeads,
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
router.get("/leads/order", orderLeads);
router.get("/leads/filter", filterLeads);

export default router;
