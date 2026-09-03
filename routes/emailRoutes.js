import express from "express";

import {
  receiveEmail
} from "../controllers/emailController.js";

import {
  getInboxMessages,
  getMessageById,
  getEmailDetails
} from "../services/gmailService.js";

import {
  classifyStoredEmails
} from "../controllers/aiController.js";

import {
  testGroqConnection,
  getGroqModels
} from "../adapters/llm/llmAdapter.js";


const router = express.Router();


// ==========================================
// RECEIVE / SAVE GMAIL EMAILS
// POST /api/emails
// ==========================================

router.post("/", receiveEmail);


// ==========================================
// CLASSIFY STORED EMAIL
// POST /api/emails/classify
// ==========================================

router.post(
  "/classify",
  classifyStoredEmails
);


// ==========================================
// TEST GMAIL CONNECTION
// GET /api/emails/gmail-test
// ==========================================

router.get(
  "/gmail-test",
  async (req, res) => {

    try {

      const messages =
        await getInboxMessages();

      res.status(200).json({

        success: true,

        count:
          messages.length,

        messages

      });

    } catch (error) {

      console.error(
        "Gmail read failed:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to read Gmail",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// GET GROQ MODELS
// GET /api/emails/groq-models
// ==========================================

router.get(
  "/groq-models",
  async (req, res) => {

    try {

      console.log(
        "Testing Groq models endpoint..."
      );

      const models =
        await getGroqModels();

      res.status(200).json({

        success: true,

        count:
          models.length,

        models:
          models.map(model => ({

            id:
              model.id,

            active:
              model.active,

            ownedBy:
              model.owned_by

          }))

      });

    } catch (error) {

      console.error(
        "Groq models failed:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to get Groq models",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// TEST GROQ CONNECTION
// GET /api/emails/groq-test
// ==========================================

router.get(
  "/groq-test",
  async (req, res) => {

    try {

      console.log(
        "Testing Groq connection..."
      );

      const result =
        await testGroqConnection();

      res.status(200).json({

        success: true,

        model:
          result.model,

        message:
          result.message

      });

    } catch (error) {

      console.error(
        "Groq test failed:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Groq connection failed",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// GET GMAIL MESSAGE
// GET /api/emails/gmail-message-test/:id
// ==========================================

router.get(
  "/gmail-message-test/:id",
  async (req, res) => {

    try {

      const message =
        await getMessageById(
          req.params.id
        );

      res.status(200).json({

        success: true,

        message

      });

    } catch (error) {

      console.error(
        "Gmail message read failed:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to read Gmail message",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// GET EMAIL DETAILS
// GET /api/emails/gmail-email-details/:id
// ==========================================

router.get(
  "/gmail-email-details/:id",
  async (req, res) => {

    try {

      const email =
        await getEmailDetails(
          req.params.id
        );

      res.status(200).json({

        success: true,

        email

      });

    } catch (error) {

      console.error(
        "Email details read failed:",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to read email details",

        error:
          error.message

      });

    }

  }
);


export default router;