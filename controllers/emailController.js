import {
  getInboxMessages,
  getEmailDetails
} from "../services/gmailService.js";

import {
  saveIncomingEmail,
  getStoredEmails
} from "../services/emailService.js";


export const receiveEmail = async (req, res) => {

  try {

    const messages =
      await getInboxMessages();

    const savedEmails = [];
    let skippedCount = 0;


    for (const message of messages) {

      const email =
        await getEmailDetails(message.id);


      const from =
        email.from || "";


      const match =
        from.match(/^(.*?)\s*<(.+)>$/);


      let senderName = "";
      let senderEmail = "";


      if (match) {

        senderName =
          match[1].trim();

        senderEmail =
          match[2].trim();

      } else {

        senderEmail =
          from.trim();

      }


      const savedEmail =
        await saveIncomingEmail({

          messageId:
            email.id,

          threadId:
            email.threadId,

          senderEmail,

          senderName,

          subject:
            email.subject,

          body:
            email.body,

          receivedAt:
            new Date(
              email.date.replace(
                " (UTC)",
                ""
              )
            )

        });


      if (savedEmail) {

        savedEmails.push(
          savedEmail
        );

      } else {

        skippedCount++;

      }

    }


    res.status(201).json({

      success: true,

      message:
        "Gmail emails processed successfully",

      total:
        messages.length,

      savedCount:
        savedEmails.length,

      skippedCount,

      data:
        savedEmails

    });


  } catch (error) {

    console.error(
      "Error saving Gmail emails:",
      error.message
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to save Gmail emails",

      error:
        error.message

    });

  }

};


// ========================================
// GET STORED EMAILS
// ========================================

export const getAllStoredEmails = async (req, res) => {

  try {

    const emails =
      await getStoredEmails();


    res.status(200).json({

      success: true,

      count:
        emails.length,

      data:
        emails

    });

  } catch (error) {

    console.error(
      "Error getting stored emails:",
      error.message
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to get stored emails",

      error:
        error.message

    });

  }

};