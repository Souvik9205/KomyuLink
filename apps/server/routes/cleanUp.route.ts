import e, { Router } from "express";
import { prisma } from "../utils/prismaClient";

const cleanUpRouter = Router();

cleanUpRouter.get("/otp/:email", async (req, res) => {
  const { email } = req.params;
  try {
    prisma.otp
      .deleteMany({
        where: {
          user: email,
        },
      })
      .then(() => {
        res.send(`OTP cleaned up for ${email}`);
      });
  } catch (error) {
    console.error("Error cleaning up OTP:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default cleanUpRouter;
