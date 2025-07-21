import express from "express";
import { createSurveyResponse, getUserSurveyHistory } from "../controllers/responseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, createSurveyResponse);         // 👈 save response
router.get("/history/:userId", protect, getUserSurveyHistory); // 👈 fetch user survey history

export default router;
