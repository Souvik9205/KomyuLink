import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server is running on port ${BACKEND_PORT}`);
});
