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
  },
  {
    tableName: "Users",
  }
);

export default User;
