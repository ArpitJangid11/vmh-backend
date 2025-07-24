import express from "express";
import {
  register,
  verifyOTP,
  login,
  resendOtp,
  resetPassword,
  sendForgotPasswordOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", sendForgotPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
export default router;
