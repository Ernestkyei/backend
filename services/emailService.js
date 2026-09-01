import { createEmail } from "../database/model/emailModal.js";

export const saveIncomingEmail = async ({
  messageId,
  senderEmail,
  senderName,
  subject,
  body,
  receivedAt
}) => {
  const email = await createEmail({
    messageId,
    senderEmail,
    senderName,
    subject,
    body,
    receivedAt
  });

  return email;
};