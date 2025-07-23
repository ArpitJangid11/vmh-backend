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
    DOB,
    marriageStatus,
    incomeBeforeTax,
    totalMembers,
    children,
    retiredPerson,
    higherDegree,
    employmentStatus,
    primayBusiness,
    no_employ,
    revenueOrganization,
    address,
    city,
    zipCode,
    referredBy,
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
      preferences: Array.isArray(preferences) ? preferences : [],
      role,
      otp,
      DOB: DOB && !isNaN(Date.parse(DOB)) ? new Date(DOB) : null,
      marriageStatus,
      incomeBeforeTax,
      totalMembers,
      children,
      retiredPerson,
      higherDegree,
      employmentStatus,
      primayBusiness,
      no_employ,
      revenueOrganization,
      address,
      city,
      zipCode,
      referredBy,
    });
    setImmediate(() => {
      sendMail({
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is: ${otp}`,
      });
    });
    // await sendMail({
    // });

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
  const start = Date.now();

  try {
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "password",
        "role",
        "fullName",
        "isEmailVerified",
      ],
    });
    console.log("User fetched:", Date.now() - start, "ms");

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    console.log("Password compared:", Date.now() - start, "ms");

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
    console.log("Token generated:", Date.now() - start, "ms");

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email for password reset" });
  } catch (err) {
    console.error("Reset request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 Reset Password with OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null; // clear OTP
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
