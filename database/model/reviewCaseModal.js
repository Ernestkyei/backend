import pool from "../database.js";

export const createReviewCase = async ({
  emailId,
  assignedTo,
  status = "OPEN",
  reason
}) => {
  const query = `
    INSERT INTO review_cases (
      email_id,
      assigned_to,
      status,
      reason
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    emailId,
    assignedTo,
    status,
    reason
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const getReviewCaseByEmailId = async (emailId) => {
  const query = `
    SELECT *
    FROM review_cases
    WHERE email_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [emailId]);

  return rows[0];
};

export const updateReviewCaseStatus = async ({
  reviewCaseId,
  status
}) => {
  const query = `
    UPDATE review_cases
    SET status = $1,
        reviewed_at = CASE
          WHEN $1 = 'RESOLVED' THEN CURRENT_TIMESTAMP
          ELSE reviewed_at
        END
    WHERE id = $2
    RETURNING *;
  `;

  const values = [
    status,
    reviewCaseId
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};