import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { generateAccessTokenUsingRefreshToken } from "../services/tokenGenerator";

const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.body.access_token;
  const userEmail = req.body.user_email;

  if (!userEmail)
    return res
      .status(401)
      .json({ message: "Please provide an email for user authentication." });

  if (!accessToken)
    return res.status(401).json({ message: "Please provide an access token." });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Access token is valid, proceed to the next middleware
    next();
  } catch (err) {
    if (err.message === "invalid signature") {
      return res.status(401).json({ message: "Invalid access token." });
    }
    if (err.message === "jwt expired") {
      try {
        const result = await generateAccessTokenUsingRefreshToken(userEmail);
        if (result) {
          console.log("New access token generated.");
          // Here you set the new token inside a cookie or response header
          next();
        } else {
          return res
            .status(409)
            .json({ message: "Refresh token expired, please log in again." });
        }
      } catch (err) {
        // Handle any errors that occur during token generation or retrieval
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }
};

export default checkAccessToken;
