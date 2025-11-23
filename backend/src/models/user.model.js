import pool from "../db_connection/db";

export async function createUser(email, passwordHash) {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2) RETURNING *;
  `;
  const values = [email, passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
}
