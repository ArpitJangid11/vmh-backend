// server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
