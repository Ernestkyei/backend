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
    ON CONFLICT (message_id) DO NOTHING
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

  return rows[0] || null;
};


export const getEmails = async () => {

  const query = `
    SELECT *
    FROM emails
    ORDER BY received_at DESC
    LIMIT 10;
  `;

  const { rows } = await pool.query(query);

  return rows;
};