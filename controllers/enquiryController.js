import { saveIncomingEmail } from "../services/emailService.js";
import { processEmail } from "../services/emailProcessingService.js";


export const submitEnquiry = async (req, res) => {

  try {

    const {
      senderEmail,
      senderName,
      subject,
      body
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (!senderEmail || !subject || !body) {

      return res.status(400).json({
        success: false,
        message:
          "Email, subject and message are required"
      });

    }


    // ========================================
    // SAVE CUSTOMER ENQUIRY
    // ========================================

    const email =
      await saveIncomingEmail({

        messageId:
          `web-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`,

        senderEmail,

        senderName:
          senderName || "",

        subject,

        body,

        receivedAt:
          new Date()

      });


    if (!email) {

      return res.status(500).json({
        success: false,
        message:
          "Failed to save enquiry"
      });

    }


    // ========================================
    // PROCESS WITH AI
    // ========================================

    const result =
      await processEmail(email);


    // ========================================
    // RETURN RESULT
    // ========================================

    return res.status(201).json({

      success: true,

      message:
        "Enquiry submitted and processed successfully",

      data: result

    });

  }

  catch (error) {

    console.error(
      "Enquiry processing failed:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to process enquiry",

      error:
        error.message

    });

  }

};