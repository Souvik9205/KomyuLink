import { compare } from "../utils/bycrypt";
import { prisma } from "../utils/prismaClient";
import jwt from "jsonwebtoken";

export const authGuard = {
  async checkExistingUser(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user !== null;
  },

  async checkExistingOTP(email: string): Promise<{
    id?: string;
    success: boolean;
  }> {
    const otp = await prisma.otp.findFirst({
      where: {
        user: email,
        type: "UserOtp",
      },
    });
    return { id: otp?.id, success: otp !== null };
  },

  async validateEmail(email: string): Promise<boolean> {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  async validatePassword(
    password: string,
    existingPassword: string
  ): Promise<boolean> {
    const isPasswordValid = await compare(password, existingPassword);
    return isPasswordValid;
  },

  async generateToken(userId: string): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    const token = jwt.sign({ userId }, secret, {
      expiresIn: "3d",
    });
    return token;
  },
};
