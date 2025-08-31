import { Response, Survey } from "../models/index.js";

export const createSurveyResponse = async (req, res) => {
  try {
    const { surveyId, surveyLink } = req.body;
    const userId = req.user.id; // comes from JWT auth middleware

    // 🔎 Find survey first to get its link
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Create response with surveyLink
    const response = await Response.create({
      userId,
      surveyId,
      surveyLink: surveyLink,
      answers: {},
      isCompleted: false,
      progress: 0,
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ message: "Failed to create response" });
  }
};

export const getUserSurveyHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await Response.findAll({
      where: { userId },
      include: [{ model: Survey }],
      order: [["createdAt", "DESC"]],
    });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
