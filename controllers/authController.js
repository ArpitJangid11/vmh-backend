import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { sendMail } from "../utils/sendEmail.js";
// import sendSMS from "../utils/sendSMS.js"; // optional

// 🔐 REGISTER with OTP
export const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    age,
    gender,
    country,
    jobTitle,
    industry,
    consent,
    preferences = [], // ✅ default to array if undefined
    role,
  } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!consent) {
      return res.status(400).json({ message: "Consent is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      country,
      jobTitle,
      industry,
      consent,
      preferences: Array.isArray(preferences) ? preferences : [], // ✅ enforce array
      role,
      otp,
    });

    await sendMail({
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is: ${otp}`,
    });

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const otp = req.body.otp;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isEmailVerified = true;
    user.isPhoneVerified = !!user.phone; // mark true if phone exists
    user.otp = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔓 LOGIN with token
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
