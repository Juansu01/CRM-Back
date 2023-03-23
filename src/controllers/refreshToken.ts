import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../models";
import messageGenerator from "../services/messageGenerator";

const secretWord = process.env.ACCESS_TOKEN_SECRET;
const newTokens = (expiresIn: string, data) =>
  jwt.sign(data, secretWord, { expiresIn });

export const refreshTokenController = async (req: Request, res: Response) => {
  const oldRefreshToken = req.headers["refresh-token"] as string;

  try {
    // token validation with db
    const data: any = jwt.verify(oldRefreshToken, secretWord);
    const user = await db.User.findOne({ where: { email: data.email } });

    if (user && user.refresh_token !== oldRefreshToken)
      throw new Error("no valid token");

    // new pair tokens
    const tokenBody = Object.assign({}, user.dataValues);
    delete tokenBody.refresh_token;

    const newRefreshToken = newTokens("24h", tokenBody);
    const newAccessToken = newTokens("48h", tokenBody);

    // update the new refresh token to db
    await db.User.update(
      { refresh_token: newRefreshToken },
      { where: { email: user.email } }
    );

    // send tokens on headers
    res.set({ Authorization: `Bearer ${newAccessToken}` });
    res.set({ "refresh-token": `${newRefreshToken}` });

    res.json(messageGenerator(["token", "refreshed"]));
  } catch (e) {
    res.status(498).json(messageGenerator(["token", "noValid"]));
  }
};
