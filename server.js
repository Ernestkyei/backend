import app from "./app.js";
import pool from "./database/database.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully!");

    app.listen(PORT, () => {
      console.log(`AI Email Agent backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("PostgreSQL connection failed:");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();