import express, { Router } from "express";
import { genSalt, hash } from "bcrypt";

const sessionAndRegistration = Router();

sessionAndRegistration.post("/register", async (req, res) => {
  const { email, password } = req.body;

  return res.status(200).json({
    message: "Registration was successful!",
    email: email,
    password: password,
  });
});

sessionAndRegistration.post("/login", async (req, res) => {
  const { email, password } = req.body;

  return res.status(200).json({
    message: "Login was successful!",
    email: email,
    password: password,
  });
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
  return res.status(200).json({
    message: "Logging you out!",
  });
});

export default sessionAndRegistration;
