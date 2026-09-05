import { createEmail, getEmails } from "../database/model/emailModal.js";

export const saveIncomingEmail = async ({
  messageId,
  threadId,
  senderEmail,
  senderName,
  subject,
  body,
  receivedAt,
}) => {
  const email = await createEmail({
    messageId,
    threadId,
    senderEmail,
    senderName,
    subject,
    body,
    receivedAt,
  });

  return email;
};

export const getStoredEmails = async () => {
  const emails = await getEmails();

  return emails;
};