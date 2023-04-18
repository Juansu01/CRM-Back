import jwt from "jsonwebtoken";
import UserAttributes from "../models/user";

export const generateAccessToken = (user: UserAttributes) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20min",
  });
};
