import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Response = sequelize.define("Response", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  surveyId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  answers: { type: DataTypes.JSONB, allowNull: false },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export default Response;
