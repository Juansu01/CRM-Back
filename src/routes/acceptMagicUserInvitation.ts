import { Router } from "express";
import {
  acceptMagicUserInvitation,
  createMagicUserInvitation,
} from "../controllers/acceptMagicUserInvitationController";

const magicUserInvitationRouter = Router();

magicUserInvitationRouter.post(
  "/accept-magic-user-invitation/:id",
  acceptMagicUserInvitation
);

magicUserInvitationRouter.post(
  "/magic-user-invitation/:funnelId",
  createMagicUserInvitation
);

export default magicUserInvitationRouter;