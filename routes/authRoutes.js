import express from "express";

import oauth2Client from "../adapters/gmail/gmailAuth.js";
import { adminLogin } from "../controllers/authController.js";
import pool from "../database/database.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

router.get("/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send"
    ]
  });

  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("Google OAuth successful!");

    res.json({
      success: true,
      message: "Google Gmail authorization successful"
    });

  } catch (error) {
    console.error("Google OAuth failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Google Gmail authorization failed"
    });
  }
});

export default router;