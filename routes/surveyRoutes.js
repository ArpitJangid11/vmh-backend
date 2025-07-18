import express from "express";
import {
  listSurveys,
  getSurvey,
  submitSurvey,
  incrementResponseCount,
} from "../controllers/surveyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listSurveys);
router.get("/:id", protect, getSurvey);
router.post("/increment-response/:id", protect, incrementResponseCount);
router.post("/:id/submit", protect, submitSurvey);

export default router;
