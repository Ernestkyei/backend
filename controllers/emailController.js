import { saveIncomingEmail } from "../services/emailService.js";

export const receiveEmail = async (req, res) => {
  try {
    const email = await saveIncomingEmail({
      messageId: req.body.messageId,
      senderEmail: req.body.senderEmail,
      senderName: req.body.senderName,
      subject: req.body.subject,
      body: req.body.body,
      receivedAt: req.body.receivedAt
    });

    res.status(201).json({
      success: true,
      message: "Email saved successfully",
      data: email
    });
  } catch (error) {
    console.error("Error saving email:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save email"
    });
  }
};