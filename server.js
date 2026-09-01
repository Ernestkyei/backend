const app = require("./app");
const pool = require("./database/database");

const PORT = process.env.PORT;

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