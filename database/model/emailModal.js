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
    SELECT
      e.*,

      c.classification,
      c.confidence,
      c.intent,
      c.reason AS classification_reason,

      d.decision,
      d.reason AS decision_reason,

      r.body AS response_body,
      r.status AS response_status,
      r.sent_at AS response_sent_at,
      r.created_at AS response_created_at

    FROM emails e

    LEFT JOIN LATERAL (
      SELECT
        classification,
        confidence,
        intent,
        reason
      FROM classifications
      WHERE email_id = e.id
      ORDER BY created_at DESC
      LIMIT 1
    ) c ON true

    LEFT JOIN LATERAL (
      SELECT
        decision,
        reason
      FROM decisions
      WHERE email_id = e.id
      ORDER BY created_at DESC
      LIMIT 1
    ) d ON true

    LEFT JOIN LATERAL (
      SELECT
        body,
        status,
        sent_at,
        created_at
      FROM responses
      WHERE email_id = e.id
      ORDER BY created_at DESC
      LIMIT 1
    ) r ON true

    ORDER BY e.received_at DESC
    LIMIT 10;
  `;

  const { rows } = await pool.query(query);

  return rows;
};