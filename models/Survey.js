// models/Survey.js
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Survey = sequelize.define(
  "Survey",
  {
    survey_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    rewardPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes",
    },
    responseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of users who attempted this survey",
    },
    preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM("active", "paused", "ended", "deleted"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    tableName: "Surveys",
  }
);

export default Survey;
