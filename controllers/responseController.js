import { Response, Survey } from "../models/index.js";

export const createSurveyResponse = async (req, res) => {
  const { userId, surveyId } = req.body;
  if (!userId || !surveyId)
    return res.status(400).json({ message: "Missing userId or surveyId" });

  try {
    const response = await Response.create({
      userId,
      surveyId,
      answers: {},
    });
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ message: "Server error" });
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
