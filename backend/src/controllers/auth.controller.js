import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db_connection/db.js";

export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id, email;",
      [email, hash]
    );

    res.json({ message: "User registered", user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = userResult.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
