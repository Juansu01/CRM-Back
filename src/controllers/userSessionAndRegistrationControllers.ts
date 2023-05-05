import { Request, Response, NextFunction } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { validate } from "email-validator";
import db from "../models";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenGenerator";

export const userRegistrationController = async (
  req: Request,
  res: Response
) => {
  const { email, password, full_name, is_admin } = req.body;
  const user = await db.User.findOne({ where: { email: email } });

  if (user) {
    return res.status(401).json({ message: "User already exists" });
  }
  if (validate(email)) {
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
          email,
          password: hash,
          is_admin: isAdmin,
          full_name,
        });

        if (newUser) {
          const rawUser = newUser.get({ plain: true });
          const token = generateAccessToken(rawUser);
          const refresh_token = generateRefreshToken(newUser.email);
          newUser.refresh_token = refresh_token;
          await newUser.save();
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
};

export const userLogInController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await db.User.scope("withPassword").findOne({
    where: { email },
  });

  if (user) {
    compare(password, user.password, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result) {
        const accessToken = generateAccessToken({ email: user.email });
        const newRefreshToken = generateRefreshToken(user.email);
        user.refresh_token = newRefreshToken;
        await user.save();
        return res.json({
          message: "Login was successful!",
          access_token: accessToken,
        });
      } else {
        return res.status(401).json({ messsage: "Wrong credentials" });
      }
    });
  } else {
    return res
      .status(404)
      .json({ message: "User not found, check your credentials" });
  }
};
