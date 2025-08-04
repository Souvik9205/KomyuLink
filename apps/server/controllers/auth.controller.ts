import { Request, Response } from "express";
import { authGuard } from "../guards/auth.guard";
import {
  userLoginService,
  userRegisterService,
  userVerificationService,
} from "../services/auth.service";

export const userRegisterController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!(await authGuard.validateEmail(email))) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const result = await userRegisterService(email, password, name);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in userRegisterController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userVerificationController = async (
  req: Request,
  res: Response
) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and email are required" });
  }
  if (!(await authGuard.validateEmail(email))) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const result = await userVerificationService(otp, email);

    res.cookie("token", result.token, {
      domain: process.env.DOMAIN ?? "localhost",
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in userVerificationController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!(await authGuard.validateEmail(email))) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const result = await userLoginService(email, password);
    if (result.token) {
      res.cookie("token", result.token, {
        domain: process.env.DOMAIN ?? "localhost",
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    }
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in userLoginController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      domain: process.env.DOMAIN ?? "localhost",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in userLogoutController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
