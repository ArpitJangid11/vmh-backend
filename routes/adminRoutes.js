import express from "express";
import {
  getAllUsers,
  getAllRewards,
  updateRewardStatus,
  createSurvey,
  deactivateSurvey,
  getAllAdminSurveys,
  updateSurvey,
  toggleSurveyActiveStatus,
  changeUserRole,
  updateUserIsActiveStatus,
} from "../controllers/adminController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/users", getAllUsers);
router.get("/rewards", getAllRewards);
router.put("/rewards/:id", updateRewardStatus);
router.put("/users/:id/role", changeUserRole);

router.post("/surveys", createSurvey);
router.get("/surveys", getAllAdminSurveys);
router.patch("/users/:id/status", updateUserIsActiveStatus);
router.put("/surveys/:id", updateSurvey);
router.put("/surveys/:id/deactivate", deactivateSurvey);
router.put("/surveys/:id/status", toggleSurveyActiveStatus);

export default router;
