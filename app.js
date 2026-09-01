import express from "express";
import cors from "cors";
import morgan from "morgan";
import emailRoutes from "./routes/emailRoutes.js"
const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));



app.use("/api/emails", emailRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "AI Email Agent",
    message: "Backend is running successfully"
  });
});

export default app;