import { Router } from "express";
import {
  userLoginController,
  userLogoutController,
  userRegisterController,
  userResendOtpController,
  userVerificationController,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", userRegisterController);
authRouter.post("/verify", userVerificationController);
authRouter.post("/login", userLoginController);
//TODO: authRouter.post("/user/refresh-token");
authRouter.post("/user/resend-otp", userResendOtpController);
//TODO: authRouter.post("/user/forgot-password");
//TODO: authRouter.post("/user/reset-password");

// authRouter.get("/google");
// authRouter.get("/google/callback");
// authRouter.get("/github");
// authRouter.get("/github/callback");

authRouter.get("/logout", userLogoutController);

export default authRouter;

//const sessionCookie = req.cookies.session;
