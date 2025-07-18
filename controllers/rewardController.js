import { Reward, User } from "../models/index.js";

export const requestReward = async (req, res) => {
  try {
    const { type, pointsUsed } = req.body;
    const user = await User.findByPk(req.user.id);

    if (user.points < pointsUsed) {
      return res.status(400).json({ message: "Not enough points" });
    }

    const reward = await Reward.create({
      userId: req.user.id,
      type,
      pointsUsed,
    });

    user.points -= pointsUsed;
    await user.save();

    res.status(201).json({ message: "Reward request submitted", reward });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll({ where: { userId: req.user.id } });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
