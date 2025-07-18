// models/index.js
import sequelize from "../config/db.js";

import User from "./User.js";
import Survey from "./Survey.js";
import Response from "./Response.js";
import Reward from "./Reward.js";

// 🧩 Define model associations
// A User has many Responses
User.hasMany(Response, { foreignKey: "userId", onDelete: "CASCADE" });
Response.belongsTo(User, { foreignKey: "userId" });

// A Survey has many Responses
Survey.hasMany(Response, { foreignKey: "surveyId", onDelete: "CASCADE" });
Response.belongsTo(Survey, { foreignKey: "surveyId" });

// A User has many Rewards
User.hasMany(Reward, { foreignKey: "userId", onDelete: "CASCADE" });
Reward.belongsTo(User, { foreignKey: "userId" });

// Export all models + sequelize instance
export { sequelize, User, Survey, Response, Reward };
