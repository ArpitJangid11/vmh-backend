import express from "express";
import {
  getProfile,
  updateProfile,
  mySurveys,
  getSurveyHistory,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/surveys", protect, mySurveys);
router.get("/survey-history", protect, getSurveyHistory);

export default router;
