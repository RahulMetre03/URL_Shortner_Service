import pool from "../db_connection/db";

export async function createLink(userId, code, targetUrl) {
  const query = `
    INSERT INTO links (user_id, code, target_url)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [userId, code, targetUrl];
  const result = await pool.query(query, values);
  return result.rows[0];
}
