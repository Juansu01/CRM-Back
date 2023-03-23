import { Router } from "express";
import {
  userRegistrationController,
  userLogInController,
} from "../controllers/userSessionAndRegistrationControllers";

const sessionAndRegistration = Router();

sessionAndRegistration.post("/users/register", userRegistrationController);
sessionAndRegistration.post("/users/login", userLogInController);

export default sessionAndRegistration;
