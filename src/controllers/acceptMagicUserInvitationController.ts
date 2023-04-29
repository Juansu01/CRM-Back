import { Request, Response } from "express";
import db from "../models";
import { validate } from "email-validator";
import { genSalt, hash } from "bcrypt";
import { generateAccessToken, generateInvitationToken } from "../services/tokenGenerator";
import jwt from "jsonwebtoken";

export const acceptMagicUserInvitation = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const invitation = await db.MagicUserInvitation.findByPk(id);
  const { password, full_name, is_admin } = req.body;

  if (invitation) {
    jwt.verify(
      invitation.token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invitation expired." });
        }
      }
    );

    if (invitation.accepted) {
      return res
        .status(401)
        .json({ message: "Invitation is already accepted." });
    }

    const invitee_email = invitation.invitee_email;
    const user = await db.User.findOne({ where: { email: invitee_email } });

    if (user) {
      return res.status(401).json({ message: "User is already registered." });
    }

    if (validate(invitee_email)) {
      genSalt(10, (err, salt) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
        }

        hash(password, salt, async (err, hash) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
          }
          const isAdmin =
            typeof is_admin == "boolean"
              ? is_admin
              : is_admin.toLowerCase() === "true";
          const newUser = await db.User.create({
            email: invitee_email,
            password: hash,
            is_admin: isAdmin,
            full_name,
          });

          if (newUser) {
            const rawUser = newUser.get({ plain: true });
            const token = generateAccessToken(rawUser);
            const funnelToInviteUser = db.Funnel.findByPk(invitation.funnel_id);

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
          } else {
            return res.status(500).json({
              message: "Internal server error, user couldn't be created",
            });
          }
        });
      });
    } else {
      return res.status(401).json({ message: "Email is not valid" });
    }
  } else {
    return res.status(401).json({ message: "Invitation was not found." });
  }
};

export const createMagicUserInvitation = async (
  req: Request,
  res: Response) => {
  const funnelId = req.params.funnelId;
  const { userId, invitee_email, timeExpires } = req.body;

  const funnel = await db.Funnel.findByPk(funnelId)
  if (funnel === null) {
    return res
      .status(401)
      .json({ message: "The funnel does not exist" });
  }

  if (/(7|15|30)d/.test(timeExpires) == false) {
    return res
      .status(401)
      .json({ message: "Expiration time entered is invalid." });
  }

  const userAdmin = await db.User.findByPk(userId)
  if (userAdmin.is_admin) {
    const user = await db.User.findOne({ where: { email: invitee_email } })
    if (user === null) {
      const invite = await db.MagicUserInvitation.findOne({ where: { invitee_email: invitee_email } })
      if (invite === null) {
        const newInvite = await db.MagicUserInvitation.create({
          invitee_email,
          funnel_id: parseInt(funnelId !== "" ? funnelId : null),
        })
        if (newInvite) {
          const inviteToken = newInvite.get({ plain: true });
          const token = generateInvitationToken(inviteToken, timeExpires);
          return res.status(200).json({
            funnelId,
            invitee_email,
            token: token,
            message: "Invitation created succesfully.",
          });
        }
      }
      else {
        return res
          .status(401)
          .json({ message: "The Invitation was previously created" });
      }
    }
    else {
      return res
        .status(401)
        .json({ message: "User is already registered." });
    }
  }
  else {
    return res
      .status(401)
      .json({ message: "You don't have administrator permission" });
  }
};
