import pool from "../database.js";

export const createAuditLog = async ({
  emailId,
  event,
  details
}) => {

  const query = `
    INSERT INTO audit_logs (
      email_id,
      event,
      details
    )
    VALUES ($1, $2, $3::jsonb)
    RETURNING *;
  `;

  let jsonDetails;

  if (typeof details === "string") {
    jsonDetails = JSON.stringify({
      message: details
    });
  } else {
    jsonDetails = JSON.stringify(details);
  }

  const values = [
    emailId,
    event,
    jsonDetails
  ];

  const { rows } = await pool.query(
    query,
    values
  );

  return rows[0];
};


export const getAuditLogsByEmailId = async (emailId) => {

  const query = `
    SELECT *
    FROM audit_logs
    WHERE email_id = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(
    query,
    [emailId]
  );

  return rows;
};