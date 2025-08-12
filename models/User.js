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
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    zipCode: { type: DataTypes.STRING },
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
