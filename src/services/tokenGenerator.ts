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
): Promise<any> => {
  const user = await db.User.findOne({ where: { email: userEmail } });
  let accessToken = "";
  if (user) {
    const refreshToken = user.refresh_token;
    jwt.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.message === "jwt expired") return null;
        }
        console.log("Generating new accessss token");
        const newAccessToken = jwt.sign(
          { user_email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "20min" }
        );
        accessToken = newAccessToken;
      }
    );
  }
  return accessToken;
};
