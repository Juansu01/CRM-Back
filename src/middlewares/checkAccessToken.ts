import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateAccessTokenUsingRefreshToken } from "../services/tokenGenerator";

const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.body.accessToken;
  const userEmail = req.body.email;

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        if (err.message === "invalid signature")
          return res.status(401).json({ message: "Invalid token" });
        if (err.message === "jwt expired") {
          const result = await generateAccessTokenUsingRefreshToken(userEmail);
          if (result) {
            console.log("New access token generated");
            // Here you set the new token inside cookie
            next();
          }
          if (!result)
            return res
              .status(409)
              .json({ message: "Refresh token expired, please log in again." });
        }
      }
      next();
    }
  );
};

export default checkAccessToken;
