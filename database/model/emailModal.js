import pool from "../database.js";

export const createEmail = async ({
  messageId,
  senderEmail,
  senderName,
  subject,
  body,
  receivedAt
}) => {
  const query = `
    INSERT INTO emails (
      message_id,
      sender_email,
      sender_name,
      subject,
      body,
      received_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    messageId,
    senderEmail,
    senderName,
    subject,
    body,
    receivedAt
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};