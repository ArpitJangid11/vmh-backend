// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },

    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    jobTitle: { type: DataTypes.STRING },
    industry: { type: DataTypes.STRING },
    consent: { type: DataTypes.BOOLEAN, defaultValue: false },
    preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    otp: { type: DataTypes.STRING },
    googleId: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    zipCode: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    referredBy: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    DOB: {
      type: DataTypes.DATE,
      allowNull: true, // change from false to true
    },
    marriageStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Single",
    },
    incomeBeforeTax: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    children: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    retiredPerson: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "null",
    },
    higherDegree: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "null",
    },
    employmentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Unemployed",
    },
    primayBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "None",
    },
    no_employ: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    revenueOrganization: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Users",
  }
);

export default User;

export const getUserSurveyHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Response.findAll({
      where: { userId },
      include: [
        {
          model: Survey,
          attributes: ["title", "category", "rewardPoints"],
        },
      ],
    });

    const result = history.map((entry) => ({
      surveyId: entry.surveyId,
      title: entry.Survey?.title,
      category: entry.Survey?.category,
      rewardPoints: entry.Survey?.rewardPoints,
      status: entry.isCompleted ? "Completed" : "In Progress",
      progress: entry.progress,
      submittedAt: entry.updatedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error("Survey History Error:", err);
    res.status(500).json({ message: "Failed to fetch survey history." });
  }
};
