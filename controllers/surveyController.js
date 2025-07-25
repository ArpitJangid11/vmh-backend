import { Survey, Response, User } from "../models/index.js";

export const listSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll({ where: { isActive: true } });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json(survey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitSurvey = async (req, res) => {
  try {
    const { answers } = req.body;

    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    // ✅ Check if user already submitted this survey
    const existing = await Response.findOne({
      where: { userId: req.user.id, surveyId: req.params.id },
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "You already submitted this survey." });

    // ✅ Store the response
    await Response.create({
      userId: req.user.id,
      surveyId: req.params.id,
      answers,
    });

    // ✅ Add points to user
    const user = await User.findByPk(req.user.id);
    user.points += survey.rewardPoints;
    await user.save();

    res.json({ message: "Survey submitted and points awarded." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const incrementResponseCount = async (req, res) => {
  const { id } = req.params;

  try {
    const survey = await Survey.findByPk(id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    survey.responseCount += 1;
    await survey.save();

    res.status(200).json({ message: "Response count updated" });
  } catch (err) {
    console.error("Error incrementing response count:", err);
    res.status(500).json({ message: "Server error" });
  }
};
