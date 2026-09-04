import pool from "../database/database.js";

export const getAuditLogs = async () => {
  const query = `
    SELECT
      al.id,
      al.email_id,
      al.event,
      al.details,
      al.created_at,

      e.subject,
      e.sender_email,
      e.sender_name,
      e.received_at

    FROM audit_logs al

    LEFT JOIN emails e
      ON al.email_id = e.id

    ORDER BY al.created_at DESC

    LIMIT 10;
  `;

  const { rows } = await pool.query(query);

  return rows;
};