import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Response = sequelize.define("Response", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  surveyId: { type: DataTypes.INTEGER, allowNull: false },
  answers: { type: DataTypes.JSONB, allowNull: false },
});

export default Response;
