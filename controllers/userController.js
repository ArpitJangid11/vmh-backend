// controllers/userController.js
import { User, Response, Survey } from "../models/index.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); //  Debug log

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "otp"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User ID ${req.user.id} not found` });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      fullName,
      phone, // optional, or make it non-editable
      password,
      age,
      gender,
      country,
      jobTitle,
      industry,
    } = req.body;

    // Only allow selected fields to be updated
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone; // You can remove this line to prevent updating phone
    if (password) user.password = await bcrypt.hash(password, 10);
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (country) user.country = country;
    if (jobTitle) user.jobTitle = jobTitle;
    if (industry) user.industry = industry;

    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        country: user.country,
        jobTitle: user.jobTitle,
        industry: user.industry,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

export const mySurveys = async (req, res) => {
  try {
    const responses = await Response.findAll({
      where: { userId: req.user.id },
      include: [{ model: Survey }],
    });

    res.json(
      responses.map((r) => ({
        survey: r.Survey.title,
        answers: r.answers,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/user/survey-history
export const getSurveyHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const responses = await Response.findAll({
      where: { userId },
      include: [
        {
          model: Survey,
          attributes: ["title", "description", "rewardPoints"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(responses);
  } catch (err) {
    console.error("Error fetching survey history:", err);
    res.status(500).json({ message: "Failed to fetch survey history" });
  }
};
