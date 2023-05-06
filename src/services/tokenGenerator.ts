import jwt from "jsonwebtoken";
import UserAttributes from "../models/user";
import { MagicUserInvitationAttributes } from "../models/magicuserinvitation";
import db from "../models";

export type timeExpires = "7d" | "15d" | "30d";

export const generateAccessToken = (user: any) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20min",
  });
};

export const generateRefreshToken = (userEmail: string) => {
  return jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5d",
  });
};

export const generateInvitationToken = (
  MagicUserInvitation: MagicUserInvitationAttributes,
  timeExpires: timeExpires = "7d"
) => {
  return jwt.sign(MagicUserInvitation, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: timeExpires,
  });
};

export const generateAccessTokenUsingRefreshToken = async (
  userEmail: string
): Promise<string | null> => {
  const user = await db.User.findOne({ where: { email: userEmail } });

  if (!user) {
    return null;
  }

  const refreshToken = user.refresh_token;
  try {
    const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);

    console.log("Generating new access token");
    const newAccessToken = jwt.sign(
      { user_email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20min" }
    );

    return newAccessToken;
  } catch (err) {
    if (err.message === "jwt expired") {
      return null;
    }
    console.error("Failed to verify refresh token");
  }
};
