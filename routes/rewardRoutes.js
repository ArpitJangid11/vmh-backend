import express from "express";
import { requestReward, myRewards } from "../controllers/rewardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requestReward);
router.get("/me", protect, myRewards);

export default router;
