import gmail from "../adapters/gmail/gmailClient.js";

export const getInboxMessages = async () => {
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10
  });

  return response.data.messages || [];
};

export const getMessageById = async (messageId) => {
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId
  });

  return response.data;
};