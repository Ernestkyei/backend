import pool from "../database.js";


export const createResponse = async ({
  emailId,
  body,
  status = "PENDING"
}) => {

  const query = `
    INSERT INTO responses (
      email_id,
      body,
      status
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    emailId,
    body,
    status
  ];

  const { rows } = await pool.query(
    query,
    values
  );

  return rows[0];
};


export const getResponseByEmailId = async (
  emailId
) => {

  const query = `
    SELECT *
    FROM responses
    WHERE email_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const { rows } = await pool.query(
    query,
    [emailId]
  );

  return rows[0];
};


export const updateResponseStatus = async (
  responseId,
  status
) => {

  const query = `
    UPDATE responses
    SET status = $1::varchar,

        sent_at = CASE
          WHEN $1::varchar = 'SENT'
          THEN CURRENT_TIMESTAMP
          ELSE sent_at
        END

    WHERE id = $2

    RETURNING *;
  `;

  const values = [
    status,
    responseId
  ];

  const { rows } = await pool.query(
    query,
    values
  );

  return rows[0];
};