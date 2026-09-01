import pool from "../database.js";

export const createDecision = async ({
  emailId,
  decision,
  reason
}) => {
  const query = `
    INSERT INTO decisions (
      email_id,
      decision,
      reason
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    emailId,
    decision,
    reason
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const getDecisionByEmailId = async (emailId) => {
  const query = `
    SELECT *
    FROM decisions
    WHERE email_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [emailId]);

  return rows[0];
};