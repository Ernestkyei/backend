import gmail from "../adapters/gmail/gmailClient.js";

export const getInboxMessages = async () => {

  const response = await gmail.users.messages.list({

    userId: "me",

    maxResults: 50

  });

  return response.data.messages || [];

};


export const getMessageById = async (messageId) => {

  const response = await gmail.users.messages.get({

    userId: "me",

    id: messageId,

    format: "full"

  });

  return response.data;

};


export const getEmailDetails = async (messageId) => {

  const message = await getMessageById(messageId);

  const headers = message.payload.headers;

  const getHeader = (name) => {

    const header = headers.find(

      (header) =>
        header.name.toLowerCase() === name.toLowerCase()

    );

    return header?.value || "";

  };

  return {

    id: message.id,

    threadId: message.threadId,

    from: getHeader("From"),

    subject: getHeader("Subject"),

    date: getHeader("Date"),

    body: message.snippet || ""

  };

};


// Send email through Gmail

export const sendGmailMessage = async ({
  to,
  subject,
  body,
  threadId
}) => {

  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body
  ];

  const rawMessage = messageParts.join("\r\n");

  const encodedMessage =
    Buffer.from(rawMessage).toString("base64url");

  const response = await gmail.users.messages.send({

    userId: "me",

    requestBody: {

      raw: encodedMessage,

      ...(threadId && { threadId })

    }

  });

  return response.data;

};