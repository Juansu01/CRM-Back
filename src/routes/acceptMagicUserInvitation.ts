import { Router } from "express";
import { acceptMagicUserInvitation } from "../controllers/acceptMagicUserInvitationController";

const magicUserInvitationRouter = Router();

magicUserInvitationRouter.post(
  "/accept-magic-user-invitation/:id",
  acceptMagicUserInvitation
);

export default magicUserInvitationRouter;
