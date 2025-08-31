import { User, Reward, Survey, Response } from "../models/index.js";
import { Op } from "sequelize";
import { Parser } from "json2csv";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll({ include: ["User"] });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRewardStatus = async (req, res) => {
  try {
    const reward = await Reward.findByPk(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    reward.status = req.body.status;
    await reward.save();

    res.json({ message: "Reward status updated", reward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSurvey = async (req, res) => {
  try {
    const { title, description, link, duration, rewardPoints, preferences } =
      req.body;
    const { id: user_id } = req.user; // 👈 secure and correct way

    const newSurvey = await Survey.create({
      title,
      description,
      link,
      duration,
      rewardPoints,
      preferences,
      user_id,
    });

    res.status(201).json({ message: "Survey created", survey: newSurvey });
  } catch (error) {
    console.error("🔥 Survey creation failed:", error);
    res
      .status(500)
      .json({ message: "Failed to create survey", error: error.message });
  }
};

export const deactivateSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    survey.isActive = false;
    await survey.save();

    res.json({ message: "Survey deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllAdminSurveys = async (req, res) => {
  try {
    const adminId = req.user.id; // extracted from JWT

    const surveys = await Survey.findAll({
      where: { user_id: adminId, status: { [Op.ne]: "deleted" } },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ surveys });
  } catch (error) {
    console.error("❌ Failed to get surveys:", error);
    res.status(500).json({ message: "Failed to fetch surveys", error });
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const adminId = req.user.id;
    const surveyId = req.params.id;

    const survey = await Survey.findOne({
      where: { survey_id: surveyId, user_id: adminId },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Update fields (safe merge)
    const {
      title,
      description,
      link,
      duration,
      rewardPoints,
      preferences,
      isActive,
    } = req.body;

    if (title !== undefined) survey.title = title;
    if (description !== undefined) survey.description = description;
    if (link !== undefined) survey.link = link;
    if (duration !== undefined) survey.duration = duration;
    if (rewardPoints !== undefined) survey.rewardPoints = rewardPoints;
    if (preferences !== undefined) survey.preferences = preferences;
    if (isActive !== undefined) survey.isActive = isActive;

    await survey.save();

    res.json({ message: "Survey updated", survey });
  } catch (error) {
    console.error("❌ Failed to update survey:", error);
    res.status(500).json({ message: "Survey update failed", error });
  }
};

// Admin: Toggle survey active status (Start / End)
// controllers/adminController.js
export const toggleSurveyActiveStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const surveyId = req.params.id;
    const { isActive } = req.body;

    const survey = await Survey.findOne({
      where: { survey_id: surveyId, user_id: adminId },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    survey.isActive = isActive;
    await survey.save();

    res.json({ message: "Survey status updated", survey });
  } catch (error) {
    console.error("❌ Toggle Survey Error:", error);
    res.status(500).json({ message: "Toggle survey failed", error });
  }
};

export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: `Role updated to ${role}`, user });
  } catch (error) {
    console.error("Role change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserIsActiveStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive; // Toggle status
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? "unblocked" : "blocked"}`,
      user,
    });
  } catch (error) {
    console.error("User status toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Pause survey
export const pauseSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    survey.status = "paused";
    await survey.save();
    res.json({ message: "Survey paused successfully", survey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resume survey
export const resumeSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    if (survey.status !== "paused") {
      return res
        .status(400)
        .json({ error: "Only paused surveys can be resumed" });
    }

    survey.status = "active";
    await survey.save();
    res.json({ message: "Survey resumed successfully", survey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End survey
export const endSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    survey.status = "ended";
    await survey.save();
    res.json({ message: "Survey ended successfully", survey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete survey
export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);
    if (!survey) return res.status(404).json({ error: "Survey not found" });

    survey.status = "deleted";
    await survey.save();
    res.json({ message: "Survey deleted successfully (soft delete)", survey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all responses for a survey
export const getSurveyResponses = async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!surveyId) {
      return res.status(400).json({ message: "Survey ID is required" });
    }

    const responses = await Response.findAll({
      where: { surveyId: surveyId },
      include: [
        { model: User, attributes: ["id", "fullName", "email"] },
        { model: Survey, attributes: ["survey_id", "title"] },
      ],
    });

    res.json(responses);
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const exportSurveyResponsesCSV = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const responses = await Response.findAll({
      where: { surveyId },
      include: [{ model: User, attributes: ["id", "fullName", "email"] }],
    });

    if (!responses.length) {
      return res.status(404).json({ message: "No responses found" });
    }

    const formatted = responses.map((r) => ({
      responseId: r.id,
      userId: r.userId,
      userName: r.User?.fullName || "",
      userEmail: r.User?.email || "",
      surveyId: r.surveyId,
      surveyLink: r.surveyLink,
      answers: JSON.stringify(r.answers),
      isCompleted: r.isCompleted,
      progress: r.progress,
      createdAt: r.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment(`survey_${surveyId}_responses.csv`);
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ message: "Failed to export CSV" });
  }
};
