import pool from "../database/database.js";

export const getDashboardStats = async () => {
  const query = `
    SELECT
      COUNT(*)::int AS total_emails,

      COUNT(*) FILTER (
        WHERE c.classification = 'IN_REMIT'
      )::int AS in_remit,

      COUNT(*) FILTER (
        WHERE c.classification = 'OUT_OF_REMIT'
      )::int AS out_of_remit,

      COUNT(*) FILTER (
        WHERE c.classification = 'NEEDS_REVIEW'
      )::int AS needs_review

    FROM (
      SELECT
        *
      FROM emails
      ORDER BY received_at DESC
      LIMIT 10
    ) e

    LEFT JOIN LATERAL (
      SELECT
        classification
      FROM classifications
      WHERE email_id = e.id
      ORDER BY created_at DESC
      LIMIT 1
    ) c ON true;
  `;

  const { rows } = await pool.query(query);

  return rows[0];
};