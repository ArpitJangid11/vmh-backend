import express from "express";
import {
  getProfile,
  updateProfile,
  mySurveys,
  getSurveyHistory,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  createSurveyResponse,
  getUserSurveyHistory,
} from "../controllers/responseController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/surveys", protect, mySurveys);
router.post("/start", protect, createSurveyResponse); // 👈 save response
router.get("/history/:userId", protect, getUserSurveyHistory);
router.get("/survey-history", protect, getSurveyHistory);

export default router;
