import pool from "../database.js";

export const createClassification = async ({
  emailId,
  classification,
  confidence,
  intent,
  reason
}) => {
  const query = `
    INSERT INTO classifications (
      email_id,
      classification,
      confidence,
      intent,
      reason
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    emailId,
    classification,
    confidence,
    intent,
    reason
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const getClassificationByEmailId = async (emailId) => {
  const query = `
    SELECT *
    FROM classifications
    WHERE email_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [emailId]);

  return rows[0];
};