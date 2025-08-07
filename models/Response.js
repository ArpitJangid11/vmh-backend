import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Response = sequelize.define(
  "Response",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    surveyId: { type: DataTypes.INTEGER, allowNull: false },
    answers: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "surveyId"],
      },
    ],
  }
);

export default Response;
