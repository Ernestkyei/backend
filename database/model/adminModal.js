import pool from "../database.js";

export const createAdmin = async ({
  email,
  passwordHash,
  role = "ADMIN"
}) => {
  const query = `
    INSERT INTO admins (
      email,
      password_hash,
      role
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, role, created_at;
  `;

  const values = [
    email,
    passwordHash,
    role
  ];

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};


export const getAdminByEmail = async (email) => {
  const query = `
    SELECT *
    FROM admins
    WHERE email = $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};