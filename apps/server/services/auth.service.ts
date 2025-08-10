///atomize the user data

import { authGuard } from "../guards/auth.guard";
import { AuthSignUpPromise } from "../types";
import { hash } from "../utils/bycrypt";
import { generateOtp } from "../utils/generateOTP";
import { EmailSent } from "../utils/mailer";
import { prisma } from "../utils/prismaClient";

export const userRegisterService = async (
  email: string,
  password: string,
  name: string
): Promise<AuthSignUpPromise> => {
  try {
    const alreadyExists = await authGuard.checkExistingUser(email);
    if (alreadyExists) {
      return { status: 409, message: "User already registered" };
    }
    const hashedPassword = await hash(password);
    const OTP = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    const checkOTP = await authGuard.checkExistingOTP(email);
    if (checkOTP.success) {
      await prisma.otp.update({
        where: { id: checkOTP.id },
        data: {
          otp: OTP,
          expiresAt: otpExpiry,
          data: {
            password: hashedPassword,
            name,
          },
        },
      });
    } else {
      await prisma.otp.create({
        data: {
          user: email,
          otp: OTP,
          expiresAt: otpExpiry,
          type: "UserOtp",
          data: {
            password: hashedPassword,
            name,
          },
        },
      });
    }
    const sendEmail = await EmailSent(email, OTP, "UserOtp", null);
    if (!sendEmail) {
      return { status: 500, message: "Failed to send OTP email" };
    }
    return {
      status: 200,
      message: "OTP sent successfully. Please check your email.",
    };
  } catch (error) {
    console.error("Error in userRegisterService:", error);
    return {
      message: "Registration failed",
      status: 500,
    };
  }
};

export const userVerificationService = async (
  otp: string,
  email: string
): Promise<AuthSignUpPromise> => {
  try {
    const existingUser = await authGuard.checkExistingUser(email);
    if (existingUser) {
      return { status: 409, message: "User already registered" };
    }

    const existingOTP = await prisma.otp.findFirst({
      where: {
        user: email,
        type: "UserOtp",
      },
    });
    if (!existingOTP) {
      return { status: 404, message: "OTP not found for this email" };
    }
    if (existingOTP.expiresAt < new Date()) {
      return { status: 400, message: "OTP has expired" };
    }
    if (existingOTP.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    const otpData = existingOTP.data as { password: string; name: string };
    if (!otpData || !otpData.password || !otpData.name) {
      return { status: 400, message: "Invalid OTP data" };
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: otpData.password,
        name: otpData.name,
        authProvider: "EMAIL_OTP",
      },
    });
    await prisma.otp.delete({
      where: {
        id: existingOTP.id,
      },
    });

    const token = await authGuard.generateToken(newUser.id);
    return {
      status: 200,
      message: "Login successful",
      token,
    };
  } catch (error) {
    console.error("Error in userLoginService:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const userLoginService = async (
  email: string,
  password: string
): Promise<AuthSignUpPromise> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const isPasswordValid = await authGuard.validatePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return { status: 401, message: "Invalid password" };
    }

    const token = await authGuard.generateToken(user.id);
    return {
      status: 200,
      message: "Login successful",
      token,
    };
  } catch (error) {
    console.error("Error in userLoginService:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const userResendOtpService = async (
  email: string
): Promise<AuthSignUpPromise> => {
  try {
    const alreadyExists = await authGuard.checkExistingUser(email);
    if (alreadyExists) {
      return { status: 409, message: "User already registered" };
    }
    const existingOTP = await authGuard.checkExistingOTP(email);
    if (!existingOTP.success) {
      return { status: 404, message: "No OTP found for this email" };
    }

    const newOtp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    await prisma.otp.update({
      where: { id: existingOTP.id },
      data: {
        otp: newOtp,
        expiresAt: otpExpiry,
      },
    });

    const sendEmail = await EmailSent(email, newOtp, "UserOtp", null);
    if (!sendEmail) {
      return { status: 500, message: "Failed to send OTP email" };
    }

    return {
      status: 200,
      message: "New OTP sent successfully. Please check your email.",
    };
  } catch (error) {
    console.error("Error in userResendOtpService:", error);
    return { status: 500, message: "Internal server error" };
  }
};
