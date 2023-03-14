import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenController = (req: Request, res: Response) => {
  const secretWord = process.env.ACCESS_TOKEN_SECRET || "secret";
  const oldRefreshToken = req.headers["refresh-token"] as string;

  try {
    // token validation with db
    jwt.verify(oldRefreshToken, secretWord);

    // new pair tokens
    const newRefreshToken = jwt.sign({}, secretWord, { expiresIn: "7 days" });
    const newAccessToken = jwt.sign({}, secretWord, { expiresIn: "24h" });

    // send tokens
    res.set({ authorization: `Bearer ${newAccessToken}` });
    res.set({ "refresh-token": `${newRefreshToken}` });

    res.json({ message: "token refreshed" });
  } catch (e) {
    return res.status(498).json({ message: "no valid token" });
  }
};
