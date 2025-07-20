import express from "express";
import {
  register,
  verifyOTP,
  login,
  resetPassword,
  sendForgotPasswordOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", sendForgotPasswordOtp);
router.post("/reset-password", resetPassword);
export default router;
