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
import checkAccessToken from "../middlewares/checkAccessToken";

const router = Router();

// CRUD
router.get("/leads", checkAccessToken, getAllLeads);
router.get("/lead/:leadId", checkAccessToken, getOneLead);
router.post("/lead", checkAccessToken, emailExistsLead, postLead);
router.patch("/lead/:leadId", checkAccessToken, patchLead);
router.delete("/lead/:leadId", checkAccessToken, deleteLead);

// Filtering
router.get("/leads/order", checkAccessToken, orderLeads);
router.get("/leads/filter", checkAccessToken, filterLeads);

export default router;
