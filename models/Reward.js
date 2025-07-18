import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Reward = sequelize.define("Reward", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING }, // e.g. 'giftcard', 'cashout'
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  pointsUsed: { type: DataTypes.INTEGER, allowNull: false },
});

export default Reward;
