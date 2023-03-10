import express, { Router, Request, Response, NextFunction } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { validate } from "email-validator";
import db from "../models";
import jwt from "jsonwebtoken";
import UserAttributes from "../models/user";

const sessionAndRegistration = Router();

function generateAccessToken(user: UserAttributes) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20min",
  });
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No authorization token" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

sessionAndRegistration.post("/register", async (req, res) => {
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
        const newUser = await db.User.create({
          email,
          password: hash,
          is_admin: is_admin === "true",
          full_name,
        });

        if (newUser) {
          const rawUser = newUser.get({ plain: true });
          const token = generateAccessToken(rawUser);
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
});

sessionAndRegistration.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.scope("withPassword").findOne({
    where: { email },
    raw: true,
    nest: true,
  });

  if (user) {
    compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result) {
        const accessToken = jwt.sign(
          { user_email: user.email },
          process.env.ACCESS_TOKEN_SECRET
        );
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
});

sessionAndRegistration.post("/recover-password", async (req, res) => {
  const { email, password } = req.body;

  return res.status(200).json({
    message: "You're trying to recover your password!",
    email: email,
    password: password,
  });
});

sessionAndRegistration.post("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
});

sessionAndRegistration.post(
  "/protected",
  authenticateToken,
  async (req, res) => {
    return res.status(200).json(req.user);
  }
);

export default sessionAndRegistration;
