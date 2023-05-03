import { Request, Response } from "express";
import db from "../models";
import { validate } from "email-validator";
import { genSalt, hash } from "bcrypt";
import {
  generateAccessToken,
  generateInvitationToken,
} from "../services/tokenGenerator";
import jwt from "jsonwebtoken";

export const acceptMagicUserInvitation = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const invitation = await db.MagicUserInvitation.findByPk(id);
    const { password, full_name, is_admin } = req.body;

    if (!invitation) {
      return res.status(401).json({ message: "Invitation was not found." });
    }

    jwt.verify(
      invitation.token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invitation expired." });
        }

        if (invitation.accepted) {
          return res
            .status(401)
            .json({ message: "Invitation is already accepted." });
        }

        const invitee_email = invitation.invitee_email;
        const user = await db.User.findOne({ where: { email: invitee_email } });

        if (user) {
          return res
            .status(401)
            .json({ message: "User is already registered." });
        }

        if (!validate(invitee_email)) {
          return res.status(401).json({ message: "Email is not valid" });
        }

        const salt = await genSalt(10);
        const hashed = await hash(password, salt);
        const isAdmin =
          typeof is_admin === "boolean"
            ? is_admin
            : is_admin.toLowerCase() === "true";
        const newUser = await db.User.create({
          email: invitee_email,
          password: hashed,
          is_admin: isAdmin,
          full_name,
        });

        if (!newUser) {
          return res.status(500).json({
            message: "Internal server error, user couldn't be created",
          });
        }

        const rawUser = newUser.get({ plain: true });
        const token = generateAccessToken(rawUser);
        const funnelToInviteUser = await db.Funnel.findByPk(
          invitation.funnel_id
        );

        if (!funnelToInviteUser) {
          return res
            .status(401)
            .json({ message: "Funnel inside invite does not exist." });
        }

        await funnelToInviteUser.addUser(newUser);
        invitation.accepted = true;
        await invitation.save();
        return res.status(200).json({
          message: "Registration was successful!",
          access_token: token,
        });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createMagicUserInvitation = async (
  req: Request,
  res: Response
) => {
  const funnelId = req.params.funnelId;
  const { userId, invitee_email, timeExpires } = req.body;

  const funnel = await db.Funnel.findByPk(funnelId);
  if (funnel === null) {
    return res.status(401).json({ message: "The funnel does not exist" });
  }

  if (/(7|15|30)d/.test(timeExpires) == false) {
    return res
      .status(401)
      .json({ message: "Expiration time entered is invalid." });
  }

  const userAdmin = await db.User.findByPk(userId);

  if (!userAdmin) {
    return res
      .status(404)
      .json({ message: "User with provided userId was not found." });
  }

  if (userAdmin.is_admin) {
    const user = await db.User.findOne({ where: { email: invitee_email } });
    if (user === null) {
      const invite = await db.MagicUserInvitation.findOne({
        where: { invitee_email: invitee_email },
      });
      if (invite === null) {
        const newInvite = await db.MagicUserInvitation.create({
          invitee_email,
          funnel_id: parseInt(funnelId !== "" ? funnelId : null),
        });
        if (newInvite) {
          const inviteToken = newInvite.get({ plain: true });
          const token = generateInvitationToken(inviteToken, timeExpires);
          newInvite.token = token;
          await newInvite.save();
          return res.status(200).json({
            invite: newInvite,
            message: "Invitation created succesfully.",
          });
        }
      } else {
        return res
          .status(401)
          .json({ message: "The Invitation was previously created" });
      }
    } else {
      return res.status(401).json({ message: "User is already registered." });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You don't have administrator permission" });
  }
};
