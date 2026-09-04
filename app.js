import express from "express";
import cors from "cors";
import morgan from "morgan";
import emailRoutes from "./routes/emailRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



app.use("/api/emails", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "AI Email Agent",
    message: "Backend is running successfully"
  });
});

export default app;