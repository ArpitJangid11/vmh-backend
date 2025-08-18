import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ← add this

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userSurveyRoutes from "./routes/surveyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser()); // ← add this before your routes
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/surveys", userSurveyRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("VMH Survey Panel API is running");
});

export default app;
