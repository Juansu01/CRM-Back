import jwt from "jsonwebtoken";
import UserAttributes from "../models/user";
import { MagicUserInvitationAttributes } from "../models/magicuserinvitation";

export type timeExpires = "7d" | "15d" | "30d"

export const generateAccessToken = (user: UserAttributes) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20min",
  });
};

export const generateInvitationToken = (
  MagicUserInvitation: MagicUserInvitationAttributes,
  timeExpires: timeExpires = '7d') => {
  return jwt.sign(
    MagicUserInvitation,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: timeExpires,
    }
  );
};