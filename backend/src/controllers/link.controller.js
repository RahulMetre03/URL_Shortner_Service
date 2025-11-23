import pool from "../db_connection/db.js";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import { generateCode } from "../utils/generateCode.js";

export async function createShortLink(req, res) {
  try {
    const { url, userId } = req.body;
    let url_test=url;
    if (!/^https?:\/\//i.test(url)) {
          url_test = "https://" + url;
        }

    // Check if URL is reachable
    try {
      const response = await fetch(url_test, { method: "HEAD" });
      if (!response.ok) {
        return res.status(400).json({ message: "Target URL is not reachable" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid or unreachable URL" });
    }

    // Check if URL already exists
    const existing = await pool.query(
      "SELECT * FROM links WHERE target_url = $1",
      [url]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "URL already exists" });
    }

    // Generate new short code
    const code = generateCode();

    const result = await pool.query(
      `INSERT INTO links (user_id, code, target_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, code, url]
    );

    res.json({ message: "Short link created", link: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getUserLinks(req, res) {
  try {
    const userId = req.query.userId;

    const result = await pool.query(
      `SELECT * FROM links WHERE user_id=$1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteLink(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query; // <-- userId from query

    await pool.query(
      `DELETE FROM links WHERE id=$1 AND user_id=$2`,
      [id, userId]
    );

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getLinkForStats(req, res) {
  try {
    const { code } = req.params;
    const { userId } = req.query;

    const result = await pool.query(
      `SELECT * FROM links WHERE code=$1 AND user_id=$2`,
      [code, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json(result.rows[0]); // return single link object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// PUBLIC: handle redirect
export async function getAndRedirect(req, res) {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE code=$1",
      [code]
    );

    if (result.rows.length === 0)
      return res.status(404).send("Link not found");

    const link = result.rows[0];

    // Update click count
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, updated_at = NOW() WHERE id=$1",
      [link.id]
    );

    return res.redirect(link.target_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
