import express from "express";

import { receiveEmail } from "../controllers/emailController.js";
import {
  getInboxMessages,
  getMessageById
} from "../services/gmailService.js";

const router = express.Router();

router.post("/", receiveEmail);

router.get("/gmail-test", async (req, res) => {
  try {
    const messages = await getInboxMessages();

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("Gmail read failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to read Gmail"
    });
  }
});

router.get("/gmail-message-test/:id", async (req, res) => {
  try {
    const message = await getMessageById(req.params.id);

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error("Gmail message read failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to read Gmail message"
    });
  }
});

export default router;