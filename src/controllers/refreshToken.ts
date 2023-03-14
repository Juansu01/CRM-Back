import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenController = (req: Request, res: Response) => {
  const secretWord = process.env.ACCESS_TOKEN_SECRET;
  const oldRefreshToken = req.headers["refresh-token"];

  // token validation
  if (!oldRefreshToken) return res.status(498).json();

  // new pair tokens
  const newRefreshToken = jwt.sign({}, secretWord, { expiresIn: "48h" });
  const newAccessToken = jwt.sign({}, secretWord, { expiresIn: "24h" });

  // send tokens
  res.header["authorization"] = newAccessToken;
  res.header["refresh-token"] = newRefreshToken;

  res.json({ message: "token refreshed" });
};
