import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.routes.js";
import linkRoutes from "./src/routes/link.routes.js";
import { getAndRedirect } from "./src/controllers/link.controller.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.get("/:code", getAndRedirect);

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
